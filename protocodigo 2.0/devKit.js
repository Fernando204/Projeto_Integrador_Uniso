import { Repository } from "./assets/js/Repository.js"

let users = JSON.parse(localStorage.getItem("users"));

console.log(users);

const repo = new Repository();
try{
    if(repo.getUserByName("teste")){
        console.log("Usuário encontrado pelo nome");
    }
}catch(e){
    console.log(e.message);
}

localStorage.removeItem("loggedUser");
console.log(localStorage.getItem("loggedUser"));