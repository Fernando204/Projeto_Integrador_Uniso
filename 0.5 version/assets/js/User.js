export class User{
    //objeto que representa o usuário
    constructor(name, email, password, securityQuestions, securityAnswers){
        this.name = name;
        this.email = email;
        this.password = password;
        this.securityQuestions = securityQuestions;
        this.securityAnswers = securityAnswers;
        this.id = 0;
        this.entries = []
        this.goals = []
    }

    getId(){
        return this.id;
    }
    getSecurityQuestions(){
        return this.securityQuestions;
    }
    getSecurityAnswers(){
        return this.securityAnswers;
    }
    getName(){
        return this.name;
    }
    getEmail(){
        return this.email;
    }
    getPassword(){
        return this.password;
    }

    setId(id){
        this.id = id;
    }
    setSecurityQuestions(questions){
        this.securityQuestions = questions;
    }
    setSecurityAnswers(answers){
        this.securityAnswers = answers;
    }
    setName(name){
        this.name = name;
    }   
    setEmail(email){
        this.email = email;
    }   
    setPassword(password){
        this.password = password;
    }


    addEntry(entry){
        this.entries.push(entry);
    }
    toString(){
        return {
            name: this.name,
            email: this.email,
            password: this.password,
            securityQuestions: this.securityQuestions,
            securityAnswers: this.securityAnswers,
            entries: this.entries,
            goals: this.goals
        }
    }
}