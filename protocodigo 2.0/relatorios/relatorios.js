import { Goals } from "../assets/js/goals.js";
import { Entries } from "../assets/js/entries.js";
import { User } from "../assets/js/User.js";
import { Repository } from "../assets/js/Repository.js";

const repositorio = new Repository();

let userEntries = [];
let userGoals = [];

let userInfo = window.userInfo;
const welcomeLabel = document.getElementById("welcomeLabel");
const entriesContainer = document.getElementById("entriesList");
const saldoLabel = document.getElementById("saldoLabel");

const descricao = [document.getElementById("descriçãoEntradas"),document.getElementById("descriçãoSaidas")];
const valor = [document.getElementById("valorEntradas"),document.getElementById("valorSaidas")];
const types = ["entradas","saidas"];

const goalName = document.getElementById("goal-name");
const goalValue = document.getElementById("goal-Value");
const goalLimitDate = document.getElementById("goal-limit-date");
const addGoalBt = document.getElementById("addGoalBt");

const goals = document.getElementById("goalsList");

welcomeLabel.innerText = "Bem vindo, "+userInfo.name+"!";

const createEntry = (type)=>{

    console.log(types[type])
    console.log(userInfo.name)
    const hoje = new Date().toLocaleDateString('pt-BR');
    let entry = new Entries(descricao[type].value, valor[type].value, types[type], hoje, userInfo.name);
    console.log(entry.toString());

    userInfo.entries.push(entry.toString());
    repositorio.updateUsers(userInfo);

       
    alert("Entrada adicionada com sucesso!");
    console.log(userInfo);
    loadEntries();
}

const createGoal = ()=>{
    let goal = new Goals(goalName.value, goalValue.value, goalLimitDate.value, "Em andamento");

    console.log(goal.getdata())

    userInfo.goals.push(goal.toString());
    repositorio.updateUsers(userInfo);
    alert("Meta adicionada com sucesso!");
}
addGoalBt.addEventListener("click",createGoal);

document.querySelectorAll(".entryBt").forEach((button,index)=>{
    button.addEventListener("click",()=>{
        createEntry(index);
    });
});

const loadEntries = ()=>{
    let saldo = 0;
    entriesContainer.innerHTML = "";
    userEntries = userInfo.entries;
    if(!Array.isArray(userEntries) || userEntries.length === 0){
        entriesContainer.innerHTML = "<p>Nenhuma entrada ou saída cadastrada.</p>";
        return;
    }
    userEntries.forEach((e)=>{
        let entryDiv = document.createElement("div");
        let tipo = e.type === "entradas" ? "lucro" : "despesa";
        entryDiv.classList.add(tipo);
        entryDiv.classList.add("report");
        entryDiv.innerHTML = `
            <h4>${e.descricao}</h4>
            <p >Tipo: ${e.type}  </p>
            <p style="margin-left: 10px">   Data: ${e.data}</p>
            <p class = "report-value">Valor: R$ ${e.valor}</p>
        `;
        entriesContainer.appendChild(entryDiv);
        if(e.type === "entradas"){
            saldo += parseFloat(e.valor);
        }else{
            saldo -= parseFloat(e.valor);
        }
    });
    saldoLabel.innerText = "Saldo: R$ "+saldo.toFixed(2);
}
loadEntries();

const deletGoals = (goalName)=>{
    let updatedGoals = [];
    userGoals.forEach((g)=>{
        if(g.nome !== goalName){
            updatedGoals.push(g);
        }
    });
    userInfo.goals = updatedGoals;
    userGoals = updatedGoals;
    repositorio.updateUsers(userInfo);
    loadGoals();
}

const loadGoals = ()=>{
    goals.innerHTML = "";
    userGoals = userInfo.goals;
    console.log(userGoals);
    if(!Array.isArray(userGoals) || userGoals.length === 0){
        console.log("Nenhuma meta cadastrada.");
        return;
    }
    userGoals.forEach((g)=>{
        let goalDiv = document.createElement("div");
        goalDiv.classList.add("report");
        goalDiv.classList.add("goal");
        goalDiv.innerHTML = `
            <h4>${g.nome}</h4>
            <div>
                <p>Valor Meta: R$ ${g.valor}  </p>
            </div>
            <div>
                <p>Data Limite: ${g.data}</p>
            </div>
            <p>Status: ${g.status}</p>
            
        `;
        const btn = document.createElement("button");
        btn.classList.add("delete-goal-button");
        btn.title = "Deletar Meta";
        btn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        btn.addEventListener("click", () => deletGoals(g.nome));

        goalDiv.appendChild(btn);
        goals.appendChild(goalDiv);
    });
}
loadGoals();