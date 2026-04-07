function initializeClientes(api) { 
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
    async function carregarClientesDoJson() {
        try {
            const resposta = await fetch('./scripts/classes/mock-data/Clientes.json'); // 'fetch' faz a requisição para buscar o arquivo JSON no caminho especificado
            const dadosBrutos = await resposta.json(); // Converte o texto bruto do arquivo em um objeto JavaScript utilizável
            const listaClientes = Object.values(dadosBrutos); // Transforma o objeto (que pode ter chaves "1", "2") em um Array para usarmos o .forEach

            if (container) { // Verifica se a div "pai" existe no HTML antes de tentar mexer nela
                container.innerHTML = ""; // Limpa o conteúdo atual da div (deleta cards antigos ou estáticos)
                listaClientes.forEach(cliente => { // Percorre cada cliente da lista para criar seu card individual
                    // Template String: cria o HTML do card preenchendo os dados do JSON nos locais ${...}
                    const cardHTML = `
                        <div class="clientes-historico cliente-info">
                            <p>${cliente.nome}</p>
                            <span style="display:none">${cliente.email}</span> 
                            <span style="display:none">${cliente.cpf}</span>    
                            <span style="display:none">${cliente.nascimento}</span>
                            <span>${cliente.compras}</span>
                            <span>Prioridade: ${cliente.pagamento}</span>
                            <span>Total de ${cliente.gastos} reais gastos</span>
                            <div class="cliente-botoes">
                                <button class="btn-maisinfocliente">Mais informações</button>
                                <button class="btn-excluir-cliente">Excluir</button>
                            </div>
                        </div>`;
                    container.insertAdjacentHTML('beforeend', cardHTML); // Injeta o HTML criado no final da lista, dentro do container pai
                });
                atualizarContador();
            }
        } catch (error) {
            console.error("Erro ao carregar clientes do JSON:", error);
        }
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
                nome: document.getElementById("cliente-nome").value,
                email: document.getElementById("cliente-email").value,
                cpf: document.getElementById("cliente-cpf").value,
                nascimento: document.getElementById("cliente-nascimento").value,
                pagamento_preferido: document.getElementById("cliente-pagamento-pref").value
            };

            try {
                await api.registerCliente(dadosParaEnviar); 
                alert("Cliente cadastrado com sucesso");
            } catch(error) {
                alert("Erro ao registrar ou servidor offline");
            } finally {
                await carregarClientesDoJson();
                modal.style.display = "none";
                form.reset();
            }
        });
        
    } else {
        console.error("Erro: Botão ou Modal não encontrados no HTML de Clientes!");
    }   

    // Delegação de Eventos para "mais info" e "excluir"
    if (container) {
        container.addEventListener("click", (evento) => { // Adiciona UM ÚNICO "ouvidor" de clique no container pai

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

                if (confirm(`Tem certeza que deseja excluir o cliente ${nomeCliente}?`)) {
                    card.remove(); // Remove o elemento HTML do card da tela imediatamente
                    atualizarContador();
                    alert("Cliente removido da visualização!");
                }
            }
        });
    };

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

    carregarClientesDoJson();
    atualizarContador()

}