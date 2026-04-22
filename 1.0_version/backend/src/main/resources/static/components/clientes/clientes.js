export function initializeClientes() { 
    // Cadastrar Cliente
    const btnAdd = document.getElementById("btn_abrir-modal-cliente");
    const modal = document.getElementById("modal-cliente-cadastro");
    const closeBtn = document.querySelector(".close-button");
    const form = document.getElementById("form-cliente-cadastro");

    // Mais Informações do Cliente
    const modalInfo = document.getElementById("modal-info-cliente");
    const closeInfo = document.querySelector(".close-info");

    const container = document.querySelector(".clientes-historicos"); // Usado para carregar clientes do JSON

    const inputBusca = document.getElementById("inputBuscaCliente"); // Captura o campo de digitação para podermos ouvir o que o usuário escreve

    let data = JSON.parse(localStorage.getItem("user-data"));//Pega do localStorage as informações sobre o usuário como id da empresa e o id do usuário em si

    if (inputBusca) { //O campo de busca existe?
        inputBusca.addEventListener("input", () => { // O ouvinte é disparado toda vez que alguma letra é digitada ou apagada
            const termoBusca = inputBusca.value.toLowerCase(); // Pega qualquer nome de cliente que o usuário digitou e coloca em letra minúscula
            const todosOsCards = document.querySelectorAll(".clientes-historico"); // Encontra todos os clientes cadastrados 
            todosOsCards.forEach(card => {
                const nomeCliente = card.querySelector("p").innerText.toLowerCase(); // Pega o nome do cliente e escreve em minúsculo
                card.style.display = nomeCliente.includes(termoBusca) ? "grid" : "none"; // "O nome que está neste cartão contém as letras que o usuário digitou no campo de busca?"
            });
        });
    }

    function atualizarContador() {
        const total = document.querySelectorAll(".clientes-historico").length; //Pega a quantidade de clientes que possui na empresa
        const displayContador = document.getElementById("contagem-total-clientes"); // Encontra o elemento que possua o id contagem-total-clientes, que é o número que mostra a quantidade de clientes
        if (displayContador) { //Se o displayContador existir, roda o código abaixo
            displayContador.innerText = total; //Escreve o ''total'' da quantidade de cliente no elemento que exibe a quantidade de clientes (displayContador)
        }
    }

    // === FUNÇÃO PARA CARREGAR OS ATORES (JSON) ===
    async function carregarClientes() {
        let listaClientes = [];

        try {
            // 1. Tenta buscar da API Real
            const responseAPI = await api.sendGetRequest("/clientes/all"); //ESPERAR O ENDPOINT CORRETO

            // Se a API retornar dados, usamos eles
            if (responseAPI && responseAPI.length > 0) {
                listaClientes = responseAPI;
            } else {
                // Se vier vazio ou erro oculto, força a ida para o catch (JSON)
                throw new Error("API sem dados");
            }
        } catch (error) {
            console.warn("API bloqueada (403) ou offline. Buscando dados do Clientes.json...");
            try {
                // 2. Tenta o caminho relativo subindo as pastas
                const response = await fetch("../../scripts/classes/mock-data/Clientes.json");

                if (!response.ok) throw new Error(`Arquivo não encontrado: ${response.status}`);

                const dadosJson = await response.json();

                // CONVERSÃO CRÍTICA: Transforma o seu JSON { "1": {...} } em uma lista [ {...} ]
                listaClientes = Object.values(dadosJson);

                console.log("Sucesso! Clientes carregados do arquivo local.");
            } catch (jsonError) {
                console.error("Erro crítico: Não encontrou nem a API nem o JSON local.", jsonError);
            }
        }

        // 3. Renderiza na tela
        if (container && listaClientes.length > 0) {
            container.innerHTML = "";
            listaClientes.forEach(cliente => {
                const cardHTML = `
                    <div class="clientes-historico cliente-info" data-id="${cliente.id || ''}">
                        <p>${cliente.nome}</p>
                        <span style="display:none">${cliente.email}</span>
                        <span style="display:none">${cliente.cpf}</span>
                        <span style="display:none">${cliente.nascimento}</span>
                        <span>${cliente.compras || '0'}</span>
                        <span>Prioridade: ${cliente.pagamento || 'N/A'}</span>
                        <span>Total de ${cliente.gastos || '0'} reais gastos</span>
                        <div class="cliente-botoes">
                            <button class="btn-maisinfocliente">Mais informações</button>
                            <button class="btn-excluir-cliente">Excluir</button>
                        </div>
                    </div>`;
                container.insertAdjacentHTML('beforeend', cardHTML);
            });
        } else {
            console.warn("Nenhum cliente para exibir no container.");
        }

        atualizarContador();
    }

    // CADASTRO DO CLIENTE
    if (btnAdd && modal && form) {

        btnAdd.addEventListener("click", () => {
            modal.style.display = "block";
        });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
            form.reset();
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault(); 

            const dadosParaEnviar = {
                companyId: data.companyId,
                name: document.getElementById("cliente-nome").value,
                email: document.getElementById("cliente-email").value,
                cpf: document.getElementById("cliente-cpf").value,
                birthDate: document.getElementById("cliente-nascimento").value,
                favoritePayment: document.getElementById("cliente-pagamento-pref").value
            };

            try {
                console.log(dadosParaEnviar)
                const res = await api.sendPostRequest("/client/create",dadosParaEnviar);

                if(res.error){
                    console.log("Erro ao registrar cliente!");
                    throw new Error(res.message || "Erro ao cadastrar cliente!");
                }

                console.log(res);
                alert("Cliente cadastrado com sucesso");
            } catch(error) {
                alert("Erro ao registrar ou servidor offline: "+error);
            } finally {
                await carregarClientes();
                modal.style.display = "none";
                form.reset();
            }
        });
        
    } else {
        console.error("Erro: Botão ou Modal não encontrados no HTML de Clientes!");
    }   

    // Delegação de Eventos para "mais info" e "excluir"
    if (container) {
        container.addEventListener("click", async (evento) => { // Adiciona UM ÚNICO "ouvidor" de clique no container pai

            if (evento.target.classList.contains("btn-maisinfocliente")) { // Verifica se o que foi clicado exatamente foi o botão de informações
                const card = evento.target.closest(".cliente-info"); // Sobe na árvore do HTML para encontrar o card (.cliente-info, linha 47) correspondente ao botão
                const nome = card.querySelector("p").innerText; // Pega o nome que está dentro da tag <p> do card
                const atributos = card.querySelectorAll("span"); //Vai na linha 47 de novo e pega todos os span
            
                document.getElementById("info-cliente-nome").innerText = nome;
                document.getElementById("info-cliente-email").innerText = atributos[0].innerText; // Pega as palavras dos span da linha 47 e reescreve no documento (modal do html) a partir do ID de cada elemento
                document.getElementById("info-cliente-cpf").innerText = atributos[1].innerText;
                document.getElementById("info-cliente-nascimento").innerText = atributos[2].innerText;
                document.getElementById("info-cliente-compras").innerText = atributos[3].innerText;
                document.getElementById("info-cliente-pagamento").innerText = atributos[4].innerText.replace("Prioridade: ", "");
                document.getElementById("info-cliente-gastos").innerText = atributos[5].innerText;

                modalInfo.style.display = "block"; 
            }

            if (evento.target.classList.contains("btn-excluir-cliente")) { // Verifica se o clique ocorreu no botão de excluir
                const card = evento.target.closest(".cliente-info"); // Identifica qual card deve ser removido
                const nomeCliente = card.querySelector("p").innerText; // Pega o nome do cliente apenas para personalizar a mensagem de confirmação
                const idCliente = card.getAttribute("data-id");

                if (confirm(`Tem certeza que deseja excluir o cliente ${nomeCliente}?`)) {
                    try {
                        // await api.sendDeleteRequest("/clientes/" + idCliente); //ESPERAR O ENDPOINT CORRETO
                        card.remove();
                        atualizarContador();
                        alert("Cliente removido com sucesso!");
                    } catch (error) {
                        alert("Erro ao excluir no servidor.");
                    }
                }
            }
        });
    }

    // Fechar modais
    if (closeInfo) {
        closeInfo.onclick = () => {
            modalInfo.style.display = "none";
        };
    }

    window.addEventListener("click", (event) => {
        if (event.target === modal) { modal.style.display = "none"; form.reset(); }
        if (event.target === modalInfo) { modalInfo.style.display = "none"; }
    });

    carregarClientes();
    atualizarContador()

}