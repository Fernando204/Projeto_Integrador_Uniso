const passo1 = document.getElementById("passo-1");
const passo2 = document.getElementById("passo-2");
const btnEnviarCodigo = document.getElementById("btn-enviar-codigo");
const btnRedefinirSenha = document.getElementById("btn-redefinir-senha");
const btnVoltarPasso1 = document.getElementById("btn-voltar-passo1");

// PASSO 1 — Enviar código
btnEnviarCodigo.addEventListener("click", async () => {
    const email = document.getElementById("recover-email").value;

    if (!email) {
        alert("Por favor, digite seu e-mail.");
        return;
    }

    try {
        // TODO: await api.sendPostRequest("/auth/recover", { email });
        console.log("Código enviado para:", email); // simulado
        passo1.style.display = "none";
        passo2.style.display = "block";
    } catch (error) {
        alert("Erro ao enviar código. Tente novamente.");
    }
});

// PASSO 2 — Redefinir senha
btnRedefinirSenha.addEventListener("click", async () => {
    const codigo = document.getElementById("recover-codigo").value;
    const novaSenha = document.getElementById("nova-senha").value;
    const confirmarSenha = document.getElementById("confirmar-nova-senha").value;

    if (!codigo || !novaSenha || !confirmarSenha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    try {
        // TODO: await api.sendPostRequest("/auth/reset-password", { codigo, novaSenha });
        console.log("Senha redefinida com sucesso!"); // simulado
        alert("Senha redefinida com sucesso!");
        window.location.href = "loginPage.html";
    } catch (error) {
        alert("Erro ao redefinir senha. Tente novamente.");
    }
});

// Voltar ao passo 1
btnVoltarPasso1.addEventListener("click", (e) => {
    e.preventDefault();
    passo2.style.display = "none";
    passo1.style.display = "block";
});