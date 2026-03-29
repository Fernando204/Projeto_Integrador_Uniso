function initializeClientes(api) { 
    // Cadastrar Cliente
    const btnAdd = document.getElementById("btn_abrir-modal-cliente");
    const modal = document.getElementById("modal-cliente-cadastro");
    const closeBtn = document.querySelector(".close-button");
    const form = document.getElementById("form-cliente-cadastro");

    // Mais Informações do Cliente
    const modalInfo = document.getElementById("modal-info-cliente");
    const closeInfo = document.querySelector(".close-info");
    const botoesMaisInfo = document.querySelectorAll(".btn-maisinfocliente");

    // Cadastro do cliente
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
                console.log("O que tem na minha API:", api);
                await api.registerCliente(dadosParaEnviar); 
                alert("Cliente cadastrado com sucesso");
            } catch(error) {
                console.error("Erro ao registrar cliente:", error);
                alert("O servidor não respondeu, mas a janela será fechada");
            } finally {
                modal.style.display = "none";
                form.reset();
            }
        });
        
    } else {
        console.error("Erro: Botão ou Modal não encontrados no HTML de Clientes!");
    }   

    // Mais informações do cliente
    if (modalInfo && botoesMaisInfo.length > 0) {
        
        // Fechar modal de info
        if (closeInfo) {
            closeInfo.onclick = () => {
                modalInfo.style.display = "none";
            };
        }

        botoesMaisInfo.forEach(botao => {
            botao.addEventListener("click", (evento) => {
                const card = evento.target.closest(".cliente-info"); 
                const nome = card.querySelector("p").innerText;
                const atributos = card.querySelectorAll("span"); 
            
                document.getElementById("info-cliente-nome").innerText = nome;
                document.getElementById("info-cliente-email").innerText = atributos[0].innerText;
                document.getElementById("info-cliente-cpf").innerText = atributos[1].innerText;
                document.getElementById("info-cliente-nascimento").innerText = atributos[2].innerText;
                document.getElementById("info-cliente-compras").innerText = atributos[3].innerText;
                document.getElementById("info-cliente-pagamento").innerText = atributos[4].innerText.replace("Prioridade: ", "");
                document.getElementById("info-cliente-gastos").innerText = atributos[5].innerText;

                modalInfo.style.display = "block"; 
            });
        });
    }
    window.addEventListener("click", (event) => {
        if (event.target === modal) { modal.style.display = "none"; form.reset(); }
        if (event.target === modalInfo) { modalInfo.style.display = "none"; }
    });
}