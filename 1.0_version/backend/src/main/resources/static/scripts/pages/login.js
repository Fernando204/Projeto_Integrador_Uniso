import { ApiConnection } from "../classes/ApiConnection.js";

const apiConnection = new ApiConnection();

const loginBt = document.getElementById("confirmBt");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

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
            alert(res.message);
            loginBt.innerHTML = "Entrar";
            return;
        }
        alert("Ususário logado com sucesso");
        location.href  = "./../index.html";

    });
}

loginBt.addEventListener("click",login);