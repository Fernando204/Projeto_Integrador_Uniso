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

    getConfigs(){
        let db = this.#getDb();
        return db.configs;
    }
    setConfigs(configs){
        let db = this.#getDb();
        db.configs = configs;
        this.#saveDb(db);
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

    saveUserConfig(config){
        let configs = this.getConfigs();
        if (!Array.isArray(configs)) {
            configs = [];
        }
        configs.push(config);
        this.setConfigs(configs);
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

    atualizeConfig(config){
        let c = this.getConfigs();

        let atualizado = false;

        for(let i=0;i<c.length;i++){
            if (c[i].user === config.user) {
                c[i] = config; 
                this.setConfigs(c);
                atualizado = true;
            }
        }

        return atualizado;
    }
    getConfigsByUserName(userName){
        let configs = this.getConfigs();
        if(!Array.isArray(configs)){
            throw new Error("Nenhuma configuração cadastrada")
        }
        let userConfigs = null;
        for(let i = 0;i<configs.length;i++){
            if(configs[i].user === userName){
                userConfigs = configs[i];
            }
        }
        if(userConfigs === null){
            throw new Error("Configuração do usuário não encontrada")
        }
        return userConfigs;
    }
   
    updateUsers(user){
        let users = this.getAllUsers();
        for(let i=0;i<users.length;i++){
            console.log(i);
            console.log("comparando "+users[i].name+" com "+user.name);
            if(users[i].name === user.name){
                users[i] = user;
                try{
                    this.#setUsers(users);

                }catch(error){
                    console.error("Erro ao atualizar usuário: "+error);
                    throw new Error("Erro ao atualizar usuário: "+error);
                }
                this.setLoggedUser(user);
                console.log('Usuário '+ user.name +' atualizado com sucesso');
            }
        }
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
        this.setLoggedUser("");
        let user = this.getUserByEmail(email);
        if(user.password === password){
            console.log("Autenticação bem sucedida para o usuário: "+user.name);
            this.setLoggedUser(user);
            return true;
        }else{
            return false;
        }
    }

    deleteUserByName(name){
        let users = this.getAllUsers();
        let updatedUsers = users.filter(user => user.name !== name);
        this.#setUsers(updatedUsers);
        this.setLoggedUser("");
    }
    deleteAllUsers(){
        this.#setUsers([]);
        this.setLoggedUser("");
    }
    logoutUser(){
        this.setLoggedUser("");
    }
}