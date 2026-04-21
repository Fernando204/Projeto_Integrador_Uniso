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
        alert("Por favor, preencha o nome completo.");
        nameInput.focus();
        return;
    }

    if(!endereco){
        alert("Por favor, preencha o endereço");
        enderecoinput.focus();
        return;
    }

    if(!phone){
        alert("Por favor, insira um numero de telefone");
        phoneInput.focus();
        return;
    }

    if (!email) {
        alert("Por favor, preencha o e-mail.");
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        alert("Por favor, insira um e-mail válido.");
        emailInput.focus();
        return;
    }

    if (!companyName) {
        alert("Por favor, preencha a razão social.");
        companyNameInput.focus();
        return;
    }

    if (!cnpj) {
        alert("Por favor, preencha o CNPJ.");
        cnpjInput.focus();
        return;
    }

    if (!password) {
        alert("Por favor, preencha a senha.");
        passwordInput.focus();
        return;
    }

    if (password !== confirmPassword) {
        alert("As senhas não conferem. Por favor, confirme a senha corretamente.");
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

    api.sendPostRequest("/auth/register",obj).then(async res =>{
        
        if(res.error){
            alert(res.message);
            return;
        }
        location.href = "loginPage.html";
    })
});