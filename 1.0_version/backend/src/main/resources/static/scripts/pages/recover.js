const passo1 = document.getElementById("passo-1");
const passo2 = document.getElementById("passo-2");
const btnEnviarCodigo = document.getElementById("btn-enviar-codigo");
const btnRedefinirSenha = document.getElementById("btn-redefinir-senha");
const btnVoltarPasso1 = document.getElementById("btn-voltar-passo1");


function showAlert(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000); // some após 4 segundos
}

function showConfirm(message) {
    return new Promise(resolve => {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = "toast toast-confirm";
        toast.innerHTML = `
            <span>${message}</span>
            <div class="toast-buttons">
                <button class="btn-sim">Sim</button>
                <button class="btn-nao">Não</button>
            </div>
        `;
        container.appendChild(toast);

        toast.querySelector(".btn-sim").onclick = () => {
            toast.remove();
            resolve(true);
        };
        toast.querySelector(".btn-nao").onclick = () => {
            toast.remove();
            resolve(false);
        };
    });
}

// PASSO 1 — Enviar código
btnEnviarCodigo.addEventListener("click", async () => {
    const email = document.getElementById("recover-email").value;

    if (!email) {
        showAlert("Por favor, digite seu e-mail.");
        return;
    }

    try {
        // TODO: await api.sendPostRequest("/auth/recover", { email });
        console.log("Código enviado para:", email); // simulado
        passo1.style.display = "none";
        passo2.style.display = "block";
    } catch (error) {
        showAlert("Erro ao enviar código. Tente novamente.");
    }
});

// PASSO 2 — Redefinir senha
btnRedefinirSenha.addEventListener("click", async () => {
    const codigo = document.getElementById("recover-codigo").value;
    const novaSenha = document.getElementById("nova-senha").value;
    const confirmarSenha = document.getElementById("confirmar-nova-senha").value;

    if (!codigo || !novaSenha || !confirmarSenha) {
        showAlert("Por favor, preencha todos os campos.");
        return;
    }

    if (novaSenha !== confirmarSenha) {
        showAlert("As senhas não coincidem.");
        return;
    }

    try {
        // TODO: await api.sendPostRequest("/auth/reset-password", { codigo, novaSenha });
        console.log("Senha redefinida com sucesso!"); // simulado
        showAlert("Senha redefinida com sucesso!");
        window.location.href = "/login";
    } catch (error) {
        showAlert("Erro ao redefinir senha. Tente novamente.");
    }
});

// Voltar ao passo 1
btnVoltarPasso1.addEventListener("click", (e) => {
    e.preventDefault();
    passo2.style.display = "none";
    passo1.style.display = "block";
});