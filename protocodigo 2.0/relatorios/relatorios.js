import { Goals } from "../assets/js/goals.js";
import { Entries } from "../assets/js/entries.js";
import { User } from "../assets/js/User.js";
import { Repository } from "../assets/js/Repository.js";

const repositorio = new Repository();

let userEntries = [];
let userGoals = [];

const welcomeLabel = document.getElementById("welcomeLabel");
const entriesContainer = document.getElementById("entriesContainer");

const descricao = [document.getElementById("descriçãoEntradas"),document.getElementById("descriçãoSaidas")];
const valor = [document.getElementById("valorEntradas"),document.getElementById("valorSaidas")];
const types = ["entradas","saidas"];

welcomeLabel.innerText = "Bem vindo, "+userInfo.name+"!";

const createEntry = (type)=>{
    let entry = new Entries(descricao[type].value,valor[type].value,types[type]);
    
    userInfo.addEntry(entry);
    repositorio.saveUser(userInfo);
}