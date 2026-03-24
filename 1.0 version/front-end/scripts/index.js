import {ApiConnection} from "./classes/ApiConnection.js"

const apiConnection = new ApiConnection();

const loginBt = document.getElementById("gotoLoginBt");
const contentBox = document.getElementById("site-content");
const changeButtons = document.querySelectorAll(".pageButton");
const userProfileButton = document.querySelector(".user-profile-button");
const notifyButton = document.querySelector(".notification-button");
const notifyContainer = document.querySelector(".notify-container");
const profileContainer = document.querySelector(".profile-container");

loginBt.addEventListener("click",()=>{window.location.href = "./Pages/loginPage.html"})

let profileCardOpened = false;
let notifyCardOpened = false;

const changePage = (pageUrl)=>{
    return fetch(pageUrl).then(res => res.text()).then((res) =>{
        contentBox.innerHTML = res;
    });
}

changePage("components/dashboard/dashboard.html").then((res)=>{
    initializeDashboard();
});

changeButtons.forEach((bt,index) =>{
    switch(index){
        case 0:
            bt.addEventListener("click",()=>{
                changePage("components/dashboard/dashboard.html").then((res)=>{
                    initializeDashboard();
                });
                
            })
            break;
        case 1:
            bt.addEventListener("click",()=>{
                changePage("components/finanças/finance.html");
            })
            break;
        case 2:
            bt.addEventListener("click",()=>{
                changePage("components/vendas/sales.html");
            })
            break;
        case 3:
            bt.addEventListener("click",()=>{
                changePage("components/clientes/clientes.html");
            })
            break;
        case 4:
            bt.addEventListener("click",()=>{
                changePage("components/estoque/estoque.html");
            })
            break;
        case 5:
            bt.addEventListener("click",()=>{
                changePage("components/relatorios/relatorios.html").then((res)=>{
                    initializeRelatorios();
                })
            })
            break;
        case 6:
            bt.addEventListener("click",()=>{
                changePage("components/colaboradores/colaboradores.html");
            })
            break;
    }
});

userProfileButton.addEventListener("click",()=>{
    if(!profileCardOpened){
        profileContainer.classList.add("expand");

        profileCardOpened = true;
    }else{
        profileContainer.classList.remove("expand");
        
    
        profileCardOpened = false;
    }
});
notifyButton.addEventListener("click",()=>{
    if(!notifyCardOpened && notifyContainer){
        console.log("abrindo")
        notifyContainer.classList.add("expand");

        notifyCardOpened = true;
    }else{
        console.log("fechando")
        notifyContainer.classList.remove("expand");

        notifyCardOpened = false;
    }
})

