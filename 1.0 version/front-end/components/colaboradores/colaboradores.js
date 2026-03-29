let cardSendoEditado = null;

function initializeColaboradores(api) { 
    // Cadastrar Funcionário
    const btnAdd = document.getElementById("btn_add_funcionarios");
    const modal = document.getElementById("modal-cadastro");
    const closeBtn = document.querySelector(".close-button");
    const form = document.getElementById("form-cadastro");

    // Mais Informações Funcionários
    const modalInfo = document.getElementById("modal-info");
    const closeInfo = document.querySelector(".close-info");
    const botoesMaisInfo = document.querySelectorAll(".btn-maisinfo");

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
                nascimento: document.getElementById("nascimento").value
            };

            try {
                await api.register(dadosParaEnviar); 
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
    if (modalInfo && botoesMaisInfo.length > 0) {
        
        // Fechar modal de info
        if (closeInfo) {
            closeInfo.onclick = () => {
                modalInfo.style.display = "none";
            };
        }

        botoesMaisInfo.forEach(botao => {
            botao.addEventListener("click", (evento) => {
                const card = evento.target.closest(".funcionario-info");  // closest(".funcionario-info") é pro programa ''subir'' nas tags do seu HTML a partir do botão até encontrar a div pai que tenha a classe .funcionario-info
                const nome = card.querySelector("p").innerText; //card.queryselector é pra procurar dentro do card que encontramos e não dentro da página inteira
                const atributos = card.querySelectorAll("span"); 
            
                document.getElementById("info-nome").innerText = nome;
                document.getElementById("info-cargo").innerText = atributos[0].innerText.replace("Cargo: ", "");  // atributos[0].innerText pega a frase "Cargo: Vendedor", o replace troca onde tá escrito "Cargo" por nada, e deixa apenas o "Vendedor"
                document.getElementById("info-status").innerText = atributos[1].innerText.replace("Status: ", "");
                // Pulei o atributo[2] pq ele seria o span da bolinha de status
                document.getElementById("info-turno").innerText = atributos[3].innerText.replace("Turno: ", "");
                document.getElementById("info-contato").innerText = atributos[4].innerText.replace("Contato: ", "");

                modalInfo.style.display = "block"; 
            });
        });

            // Fecha ao clicar fora do modal de informações dos funcionários
        window.addEventListener("click", (event) => {
            if (event.target == modalInfo) {
                modalInfo.style.display = "none";
            }
            // Fecha ao clicar fora do modal de cadastro do funcionário
            if (event.target == modal) {
                  modal.style.display = "none";
            }
        });
    }

    // Editar Funcionário
    const modalEditar = document.getElementById("modal-editar");
    const closeEdit = document.querySelector(".close-edit");
    const botoesEditar = document.querySelectorAll(".btn-editar");
    const formEditar = document.getElementById("form-editar");

    if (modalEditar && botoesEditar.length > 0) {

        // 1. Abrir e Preencher
        botoesEditar.forEach(botao => {
            botao.addEventListener("click", (evento) => {
                cardSendoEditado = evento.target.closest(".funcionario-info"); //linha de teste
                const card = evento.target.closest(".funcionario-info");
                const nome = card.querySelector("p").innerText;
                const atributos = card.querySelectorAll("span");

                // .value para preencher os inputs
                document.getElementById("editar-nome").value = nome;
                document.getElementById("editar-cargo").value = atributos[0].innerText.replace("Cargo: ", "");

                const statusAtual = atributos[1].innerText.replace("Status: ", "").trim(); //Vai pegar a palavra referente ao status atual da pessoa () e remover espaços antes e depois com o trim (pra não pegar a bolinha)
                document.getElementById("editar-status").value = statusAtual; //Vai selecionar o status atual da pessoa no select
                
                document.getElementById("editar-turno").value = atributos[3].innerText.replace("Turno: ", ""); //Vai dar replace na palavra "Turno" por nada, vai encontrar o input lá no modal-editar e vai colocar o turno neste input e acessá-lo com .value
                document.getElementById("editar-contato").value = atributos[4].innerText.replace("Contato: ", "");

                modalEditar.style.display = "block";
            });
        });

        // 2. Fechar
        if (closeEdit) {
            closeEdit.onclick = () => modalEditar.style.display = "none";
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
                cardSendoEditado.querySelectorAll("span")[0].innerText = "Cargo: " + novoCargo; //teste
                cardSendoEditado.querySelectorAll("span")[1].childNodes[0].textContent = "Status: " + novoStatus + " "; //teste, o childNodes[0] só mexe no primeiro item do span[1], que é o texto: "Status: Ativo"
                cardSendoEditado.querySelectorAll("span")[3].innerText = "Turno: " + novoTurno; //teste
                cardSendoEditado.querySelectorAll("span")[4].innerText = "Contato: " + novoContato; //teste

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
}