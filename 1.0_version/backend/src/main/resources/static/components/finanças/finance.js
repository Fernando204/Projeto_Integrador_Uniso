export function initializeFinances(api){

     const btnAdd = document.getElementById("btn_add_Movment");
     const modal = document.getElementById("modal-movment-register");
     const closeBtn = document.querySelector(".close-button");
     const form = document.getElementById("form-cadastro");

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
}