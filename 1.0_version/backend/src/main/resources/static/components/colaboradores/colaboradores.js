let cardSendoEditado = null;

function initializeColaboradores(api) { 

    // Função para atualizar o contador de colaboradores
    function atualizarContador() {
        const total = document.querySelectorAll(".funcionario-info").length; //Pega a quantidade de funcionários que possui na empresa
        const displayContador = document.getElementById("contagem-total-funcionarios"); //Encontra o elemento que possua o id contagem-total-funcionarios, que é o número que mostra a quantidade de funcionários
        if (displayContador) { //Se o displayContador existir, roda o código abaixo
            displayContador.innerText = total; //Escreve o ''total'' da quantidade de funcionário no elemento que exibe a quantidade de funcionários (displayContador)
        }
    }



    // Gerar card ao cadastrar funcionário
    function adicionarCardNaTela(dados) {
        const container = document.querySelector(".funcionarios-info");
        const novoCardHTML = `
            <div class="funcionario-info">
                <p>${dados.nome}</p>
                <span class="info-nascimento-card" style="display:none;">Data: ${dados.nascimento}</span>
                
                <span>Cargo: ${dados.cargo}</span>

                <span>Status: Ativo <span class="dot dot-ativo"></span></span>
                <span>Turno: ${dados.turno}</span>
                <span>Contato: ${dados.contato}</span>

                <div class="produto-botoes">
                    <button class="btn-editar">Editar</button>
                    <button class="btn-maisinfo">Mais informações</button>
                    <button class="btn-excluir">Excluir</button>
                </div>
            </div>
        `;
        container.innerHTML += novoCardHTML;
    }


    // Cadastrar Funcionário
    const btnAdd = document.getElementById("btn_add_funcionarios");
    const modal = document.getElementById("modal-colaborador-cadastro");
    const closeBtn = document.querySelector(".close-button");
    const form = document.getElementById("form-cadastro");

    // Mais Informações Funcionários
    const modalInfo = document.getElementById("modal-info-colaborador");
    const closeInfo = document.querySelector(".close-info");

    // --- Filtro no input e excluír funcionário ---
    const inputBusca = document.getElementById("inputBuscaColaborador"); //Captura o campo de digitação para podermos ouvir o que o usuário escreve
    const containerCards = document.querySelector(".funcionarios-info"); //Fica parado "ouvindo" qualquer clique que aconteça no card pai e depois filtra se foi no botão de excluir, mais-info ou editar

    if (inputBusca) { //O campo de busca existe?
        inputBusca.addEventListener("input", () => { //O ouvinte é disparado toda vez que alguma letra é digitada ou apagada
            const termoBusca = inputBusca.value.toLowerCase(); //Pega qualquer nome de funcionário que o usuário digitou e coloca em letra minúscula

            const todosOsCardsAtualizados = document.querySelectorAll(".funcionario-info") //Encontra todos os funcionários cadastrados 

            todosOsCardsAtualizados.forEach(card => {
                const nomeFuncionario = card.querySelector("p").innerText.toLowerCase(); //Pega o nome do funcionário e escreve em minúsculo
                card.style.display = nomeFuncionario.includes(termoBusca) ? "grid" : "none"; //"O nome que está neste cartão contém as letras que o usuário digitou no campo de busca?"
            });
        });
    }

    if (containerCards) { //Excluir Funcionário
    containerCards.addEventListener("click", (evento) => {
        if (evento.target.classList.contains("btn-excluir")) { // Verifica se o que foi clicado EXATAMENTE é o botão de excluir
            
            const card = evento.target.closest(".funcionario-info"); //Subir do botão até achar o card (.funcionario-info)
            const nomeFuncionario = card.querySelector("p").innerText; //Pega o nome do funcionário e guarda numa constante

            const confirmar = confirm(`Tem certeza que deseja excluir o colaborador ${nomeFuncionario}?`); //Exibe o nome do funcionário na constante para confirmar exclusão

            if (confirmar) {
                card.remove(); // Remove o elemento do HTML na hora
                atualizarContador();
                alert("Colaborador removido com sucesso!");
                
                // Futuramente: aqui terá o api.delete(id)
            }};
        });
    }



    // Cadastro do funcionário
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
                nome: document.getElementById("nome").value,
                email: document.getElementById("email").value,
                senha: document.getElementById("cpf").value,
                nascimento: document.getElementById("nascimento").value,
                cargo: document.getElementById("cargo").value,
                turno: document.getElementById("turno").value,
                contato: document.getElementById("contato").value
            };

            try {
                await api.register(dadosParaEnviar); 
                adicionarCardNaTela(dadosParaEnviar);
                atualizarContador();
                alert("Funcionário cadastrado com sucesso");
            } catch(error) {
                console.error("Erro ao registrar:", error);
                alert("O servidor não respondeu, mas a janela será fechada");
            } finally {
                modal.style.display = "none";
                form.reset();
            }
        });
    } else {
        console.error("Erro: Botão ou Modal não encontrados no HTML de Colaboradores!");
    }

    // Mais informações do funcionário
    if (modalInfo && containerCards) {
        
        // Fechar modal de info
        if (closeInfo) {
            closeInfo.onclick = () => {
                modalInfo.style.display = "none";
            };
        }

        containerCards.addEventListener("click", (evento) => {
            if (evento.target.classList.contains("btn-maisinfo")) { // Esse código só roda se o botão que foi clicado for o botão de mais informações
            const card = evento.target.closest(".funcionario-info");  // closest(".funcionario-info") é pro programa ''subir'' nas tags do HTML a partir do botão até encontrar a div pai que tenha a classe .funcionario-info
            const nome = card.querySelector("p").innerText; //card.queryselector é pra procurar dentro do card que encontramos e não dentro da página inteira
            const atributos = card.querySelectorAll("span"); 

            const dataBruta = atributos[0].innerText.replace("Data: ", "");
            const dataFormatada = dataBruta.split('-').reverse().join('/');
        
            document.getElementById("info-nome").innerText = nome;
            document.getElementById("info-nascimento").innerText = dataFormatada;
            document.getElementById("info-cargo").innerText = atributos[1].innerText.replace("Cargo: ", "");  // atributos[0].innerText pega a frase "Cargo: Vendedor", o replace troca onde tá escrito "Cargo" por nada, e deixa apenas o "Vendedor"
            document.getElementById("info-status").innerText = atributos[2].innerText.replace("Status: ", "");
            // Pulei o atributo[3] pq ele seria o span da bolinha de status
            document.getElementById("info-turno").innerText = atributos[4].innerText.replace("Turno: ", "");
            document.getElementById("info-contato").innerText = atributos[5].innerText.replace("Contato: ", "");

            modalInfo.style.display = "block"; 
            }
        });
    }

    // Editar Funcionário
    const modalEditar = document.getElementById("modal-editar");
    const closeEdit = document.querySelector(".close-edit");
    const formEditar = document.getElementById("form-editar");

    if (modalEditar && containerCards) {

        // 1. Abrir e Preencher
        containerCards.addEventListener("click", (evento) => {
            if (evento.target.classList.contains("btn-editar")) { // Esse código só roda se o botão que foi clicado for o botão de editar
                cardSendoEditado = evento.target.closest(".funcionario-info"); //linha de teste
                const card = evento.target.closest(".funcionario-info");
                const nome = card.querySelector("p").innerText;
                const atributos = card.querySelectorAll("span");

                // .value para preencher os inputs
                document.getElementById("editar-nome").value = nome;
                document.getElementById("editar-cargo").value = atributos[1].innerText.replace("Cargo: ", "");

                const statusAtual = atributos[2].innerText.replace("Status: ", "").trim(); //Vai pegar a palavra referente ao status atual da pessoa () e remover espaços antes e depois com o trim (pra não pegar a bolinha)
                document.getElementById("editar-status").value = statusAtual; //Vai selecionar o status atual da pessoa no select
                
                document.getElementById("editar-turno").value = atributos[4].innerText.replace("Turno: ", ""); //Vai dar replace na palavra "Turno" por nada, vai encontrar o input lá no modal-editar e vai colocar o turno neste input e acessá-lo com .value
                document.getElementById("editar-contato").value = atributos[5].innerText.replace("Contato: ", "");

                modalEditar.style.display = "block";
            }
        });

        // 2. Fechar modal de edição
        if (closeEdit) {
            closeEdit.onclick = () => {
                modalEditar.style.display = "none";
            };
        }

        // 3. Salvar (Opcional por enquanto, para teste)
        if (formEditar) {
            formEditar.onsubmit = (e) => {
                e.preventDefault();

                const novoNome = document.getElementById("editar-nome").value; //teste
                const novoCargo = document.getElementById("editar-cargo").value; //teste
                const novoStatus = document.getElementById("editar-status").value; //teste
                const bolinha = cardSendoEditado.querySelector(".dot"); //teste
                const novoTurno = document.getElementById("editar-turno").value; //teste
                const novoContato = document.getElementById("editar-contato").value; //teste
            

                cardSendoEditado.querySelector("p").innerText = novoNome; //teste
                cardSendoEditado.querySelectorAll("span")[1].innerText = "Cargo: " + novoCargo; //teste
                cardSendoEditado.querySelectorAll("span")[2].childNodes[0].textContent = "Status: " + novoStatus + " "; //teste, o childNodes[0] só mexe no primeiro item do span[1], que é o texto: "Status: Ativo"
                cardSendoEditado.querySelectorAll("span")[4].innerText = "Turno: " + novoTurno; //teste
                cardSendoEditado.querySelectorAll("span")[5].innerText = "Contato: " + novoContato; //teste

                bolinha.classList.remove("dot-ativo", "dot-ferias", "dot-licenca"); //teste

                if (novoStatus === "Ativo") { //teste
                    bolinha.classList.add("dot-ativo"); //teste
                } else if (novoStatus === "Férias") { //teste
                    bolinha.classList.add("dot-ferias"); //teste
                } else if (novoStatus === "Licença") { //teste
                    bolinha.classList.add("dot-licenca"); //teste
                }

                alert("Dados prontos para enviar para a API!");
                modalEditar.style.display = "none";
            };
        }
    }

    atualizarContador(); //Ao carregar a página já carrega o número de funcionários


    window.addEventListener("click", (event) => { //fechar modal quando clickar fora dele
        if (event.target === modal) modal.style.display = "none";
        if (event.target === modalInfo) modalInfo.style.display = "none";
        if (event.target === modalEditar) modalEditar.style.display = "none";
    });
}