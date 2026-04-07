import { ApiConnection } from "../classes/ApiConnection";

const apiConnection = new ApiConnection();

const loginBt = document.getElementById("confirmBt");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const login = ()=>{
    const password = passwordInput.value;
    const email = emailInput.value;

    const obj = {
        "email":email,
        "password": password
    };

    const response = apiConnection.sendPostRequest("/auth/login",obj);
}

loginBt.addEventListener("click",login);