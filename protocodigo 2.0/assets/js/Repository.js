import {User} from "./User.js";

export class Repository{
    constructor(){}

    saveUser(user){
        let users = JSON.parse(localStorage.getItem("users"));
        if(!Array.isArray(users)){
            users = []
        }
        user.setId(users.length + 1);
        users.push(user.toString());
         
        console.log("numero de usuários: "+users.length);
        localStorage.setItem("users", JSON.stringify(users));
    }

    getUserByName(name){
        let users = JSON.parse(localStorage.getItem("users"));
        if(!Array.isArray(users)){
            throw new Error("Nenhum usuário cadastrado")
        }

        let user = null;
        console.log(users.length);
        for(let i = 0;i<users.length;i++){
            console.log(i)
            console.log("comparando "+users[i].name+" com "+name);
            if(users[i].name === name){
                console.log("Usuário "+name+" encontrado");
                user = users[i];
            }
        }

        if(user === null){
            throw new Error("Usuário não cadastrado")
        }else{
            return user;
        }
    }
    getUserByEmail(email){
        console.log("procurando usuário com email: "+email);
        let users = JSON.parse(localStorage.getItem("users"));
        if(!Array.isArray(users)){
            throw new Error("Nenhum usuário cadastrado")
        }
        let user = null;
        console.log(users[0].email);
        for(let i = 0;i<users.length;i++){
            console.log("comparando "+users[i].email+" com "+email);
            console.log(users[i].email);
            if(users[i].email === email){
                user = users[i];
            }
        }

        if(user === null){
            throw new Error("Usuário não cadastrado")
        }else{
            return user;
        }
    }

    existByName(name){
        let users = JSON.parse(localStorage.getItem("users"));
        if(!Array.isArray(users)){
            console.log("nenhum usuário cadastrado");
            return false;
        }
        let user = null;
        for(let i = 0;i<users.length;i++){
            if(users[i].name === name){
                console.log("Usuário "+name+" encontrado");
                user = users[i];
            }
        }

        if(user === null){
            console.log("Usuário não cadastrado");
            return false;
        }else{
            return true;
        }
    }

    existisByEmail(){
        console.log("procurando usuário com email: "+email);
        let users = JSON.parse(localStorage.getItem("users"));
        if(!Array.isArray(users)){
            return false;
        }
        let user = null;
        console.log(users[0].email);
        for(let i = 0;i<users.length;i++){
            console.log("comparando "+users[i].email+" com "+email);
            console.log(users[i].email);
            if(users[i].email === email){
                user = users[i];
            }
        }

        if(user === null){
            return false;
        }else{
            return true;
        }
    }

    autenticateUser(email, password){
        localStorage.removeItem("loggedUser");
        let user = this.getUserByEmail(email);
        if(user.password === password){
            localStorage.setItem("loggedUser", JSON.stringify(user));
            return true;
        }else{
            return false;
        }
    }
}