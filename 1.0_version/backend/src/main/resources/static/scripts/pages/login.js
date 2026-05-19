import { ApiConnection } from "../classes/ApiConnection.js";

const apiConnection = new ApiConnection();

const loginBt = document.getElementById("confirmBt");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

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

const login = ()=>{
    const password = passwordInput.value;
    const email = emailInput.value;

    loginBt.innerHTML = "Carregando...";

    const obj = {
        "email":email,
        "password": password
    };

    apiConnection.sendPostRequest("/auth/login",obj).then(res =>{
        if(res.error){
            console.log(res)
            showAlert(res.message);
            loginBt.innerHTML = "Entrar";
            return;
        }
        showAlert("Ususário logado com sucesso");
        location.href  = "http://localhost:8080";

    });
}

loginBt.addEventListener("click",login);