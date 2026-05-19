import {ApiConnection} from "../classes/ApiConnection.js"

const api = new ApiConnection();

const nameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const companyNameInput = document.getElementById("company-name");
const cnpjInput = document.getElementById("cnpj");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const phoneInput = document.getElementById("phone");
const enderecoinput = document.getElementById("endereco");

const confirmBt = document.getElementById("confirmBt");

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

confirmBt.addEventListener("click",()=>{
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const companyName = companyNameInput.value.trim();
    const cnpj = cnpjInput.value.trim();
    const phone = phoneInput.value.trim();
    const endereco = enderecoinput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

  
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (!name) {
        showAlert("Por favor, preencha o nome completo.");
        nameInput.focus();
        return;
    }

    if(!endereco){
        showAlert("Por favor, preencha o endereço");
        enderecoinput.focus();
        return;
    }

    if(!phone){
        showAlert("Por favor, insira um numero de telefone");
        phoneInput.focus();
        return;
    }

    if (!email) {
        showAlert("Por favor, preencha o e-mail.");
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showAlert("Por favor, insira um e-mail válido.");
        emailInput.focus();
        return;
    }

    if (!companyName) {
        showAlert("Por favor, preencha a razão social.");
        companyNameInput.focus();
        return;
    }

    if (!cnpj) {
        showAlert("Por favor, preencha o CNPJ.");
        cnpjInput.focus();
        return;
    }

    if (!password) {
        showAlert("Por favor, preencha a senha.");
        passwordInput.focus();
        return;
    }

    if (password !== confirmPassword) {
        showAlert("As senhas não conferem. Por favor, confirme a senha corretamente.");
        confirmPasswordInput.focus();
        return;
    }

    const obj = {
        "name": name,
        "email":email,
        "razaoSocial": companyName,
        "cpfOrCnpj": cnpj,
        "password": password,
        "phone": phone,
        "endereco": endereco
    }
    
    confirmBt.innerText = "Registrando...";
    confirmBt.disabled = true;

    api.sendPostRequest("/auth/register",obj).then(async res =>{
        
        if(res.error){
            showAlert(res.message);
            console.log(res);
            return;
        }
        location.href = "loginPage.html";
    })
});