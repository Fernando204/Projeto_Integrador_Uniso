import {Repository} from "../assets/js/Repository.js";

const dashboard = document.querySelector("#dc");
const configsContainer = document.querySelector(".config-container");
const configBt = document.getElementById("configBt");

configBt.addEventListener("click",()=>{
    dashboard.style.display = "none";
    configsContainer.style.display = "flex";
});
document.getElementById("back-bt").addEventListener("click",()=>{
    descartConfigs();
    dashboard.style.display = "block";
    configsContainer.style.display = "none";
})

const cardTitle = document.querySelector('.card-title');
const repository = new Repository();
const configHandler = document.getElementById("config-handler")

const saveConfigBt = document.querySelector(".save");
const descartConfigBt = document.querySelector(".descart");

let configs = repository.getConfigsByUserName(userInfo.name);
console.log(configs);
let configArray = [configs.enableNotifications,configs.faltaProdutos, configs.vencimento]; 

document.getElementById('logout-bt').addEventListener('click',()=>{
    repository.logoutUser();
    window.location.href = "../index.html";
});

let configChange = false;

const configCheckBox = document.querySelectorAll('.config-checkBox');
if(configCheckBox) console.log('checkBox encontrado '+ configCheckBox.length);
configCheckBox.forEach((checkBox,index) =>{
    console.log(index+" "+configArray[index]);
    checkBox.checked = configArray[index];

    checkBox.addEventListener("input",()=>{
        if (checkBox.checked !== configArray[index] && !configChange) {
            configHandler.style.display = "flex";
            configChange = true;
        }else if(
            configCheckBox[0].checked === configArray[0] &&
            configCheckBox[1].checked === configArray[1] &&
            configCheckBox[2].checked === configArray[2] 
        ){
            configHandler.style.display = "none";
            configChange = false;
        }

        if (configCheckBox[0].checked !== true) {
            console.log("test");
        }
    })
});

saveConfigBt.addEventListener("click",()=>{
    let newConfig = {
        user: userInfo.name,
        enableNotifications: configCheckBox[0].checked,
        faltaProdutos: configCheckBox[1].checked,
        vencimento: configCheckBox[2].checked
    }

    console.log(newConfig);
    if(repository.atualizeConfig(newConfig)){
        configHandler.style.display = "none";
        configChange = false;

        configs = newConfig;
        configArray = [configs.enableNotifications,configs.faltaProdutos, configs.vencimento]; 
    }else{
        alert("erro ao atualizar");
    }
});

const descartConfigs = ()=>{
    configCheckBox.forEach((c,i)=>{
        c.checked = configArray[i];
    });
    configChange = false;
    configHandler.style.display = "none";
}

descartConfigBt.addEventListener("click",descartConfigs);

cardTitle.innerText = "Bem vindo, "+userInfo.name+"!";