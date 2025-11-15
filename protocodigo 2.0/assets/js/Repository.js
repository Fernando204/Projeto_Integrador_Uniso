import {User} from "./User.js";

export class Repository{
    constructor(){}

    #getDb(){
        let db = JSON.parse(localStorage.getItem("microgestor"));
        if(db === null){
            db = {
                users: []
            }
            localStorage.setItem("microgestor", JSON.stringify(db));
        }

        return db;
    }
    #saveDb(db){
        localStorage.setItem("microgestor", JSON.stringify(db));
    }

    getEntries(){
        let db = this.#getDb();
        return db.entries;
    }
    #setEntries(entries){
        if(!Array.isArray(entries)){
            throw new Error("Entries deve ser um array");
        }
        let db = this.#getDb();
        db.entries = entries;
        this.#saveDb(db);
    }

    getAllGoals(){
        let db = this.#getDb();
        return db.goals;
    }
    #setGoals(goals){
        if(!Array.isArray(goals)){
            throw new Error("Goals deve ser um array");
        }
        let db = this.#getDb();
        db.goals = goals;
        this.#saveDb(db);
    }


    getAllUsers(){
        let db = this.#getDb();
        return db.users;
    }
    #setUsers(users){
        if(!Array.isArray(users)){
            throw new Error("Users deve ser um array");
        }
        let db = this.#getDb();
        db.users = users;
        this.#saveDb(db);
    }

    getLoggedUser(){
        let db = this.#getDb();
        return db.loggedUser;
    }
    setLoggedUser(user){
        if(user === null){
            throw new Error("LoggedUser não pode ser nulo");
        }
        let db = this.#getDb();
        db.loggedUser = user;
        this.#saveDb(db);
    }

    saveUser(user){
        let users = this.getAllUsers();
        if(!Array.isArray(users)){
            users = []
        }
        user.setId(users.length + 1);
        users.push(user.toString());
         
        console.log("numero de usuários: "+users.length);

        this.#setUsers(users);
    }
    saveEntry(entry){
        let entries = this.getEntries();
        if(!Array.isArray(entries)){
            entries = []
        }
        entries.push(entry.toString());
        this.#setEntries(entries);
    }
    saveGoal(goal){
        let goals = this.getAllGoals();
        if(!Array.isArray(goals)){
            goals = []
        }
        goals.push(goal.toString());
        this.#setGoals(goals);
    }

    getEntryByUserId(userId){
        let entries = this.getEntries();
        if(!Array.isArray(entries)){
            throw new Error("Nenhuma entrada cadastrada")
        }
        let userEntries = [];
        for(let i = 0;i<entries.length;i++){
            if(entries[i].userId === userId){
                userEntries.push(entries[i]);
            }
        }
        return userEntries;
    }
    getGoalsByUserId(userId){
        let goals = this.getAllGoals();
        if(!Array.isArray(goals)){
            throw new Error("Nenhum objetivo cadastrado")
        }
        let userGoals = [];
        for(let i = 0;i<goals.length;i++){
            if(goals[i].userId === userId){
                userGoals.push(goals[i]);
            }
       }
        return userGoals;
    }

    getUserByName(name){
        let users = this.getAllUsers();
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
        let users = this.getAllUsers();
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
        let users = this.getAllUsers();
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
        let users = this.getAllUsers();
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
        this.setLoggedUser(null);
        let user = this.getUserByEmail(email);
        if(user.password === password){
            this.setLoggedUser(user);
            return true;
        }else{
            return false;
        }
    }
}