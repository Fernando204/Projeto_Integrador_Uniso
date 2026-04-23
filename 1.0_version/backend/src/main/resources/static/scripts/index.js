import { initializeClientes } from "../components/clientes/clientes.js";
import { initializeColaboradores } from "../components/colaboradores/colaboradores.js";
import { initializeDashboard } from "../components/dashboard/dashboard.js";
import { initializeRelatorios } from "../components/relatorios/relatorios.js";
import { initializeSales } from "../components/vendas/Sales.js";
import { initializeFinances } from "../components/finanças/finance.js";
import { initializeEstoque } from "../components/estoque/estoque.js";
import { ApiConnection } from "./classes/ApiConnection.js"
/**
 * 
 * pagina principal ->
 *  
 * receita: tudo os entrou 
 * lucro: receita - despesa
 * saldo: total acumulado de todo o periodo;
 * despesas: tudo oq saiu 
 */

const apiConnection = new ApiConnection();
const userInfoModal = document.getElementById("user-info-modal");
const loginBt = document.getElementById("gotoLoginBt");
const contentBox = document.getElementById("site-content");
const changeButtons = document.querySelectorAll(".pageButton");
const userProfileButton = document.querySelector(".user-profile-button");
const notifyButton = document.querySelector(".notification-button");
const notifyContainer = document.querySelector(".notify-container");
const profileContainer = document.querySelector(".profile-container");

const redirectToLogin = () => {
    location.href = "Pages/loginPage.html";
};

const logout = async () => {
    try {
        await apiConnection.logout();
    } finally {
        redirectToLogin();
    }
};

const renderUserModal = (user) => {
    userInfoModal.innerHTML = `
        <div class="profile-modal-top">
            <p class="title"></p>
            <p class="modal-sub-title"></p>
        </div>

        <button id="settingsBtn">Configurações</button>
        <button id="logoutBtn" class="logout-btn">Logout</button>
    `;

    userInfoModal.querySelector(".title").textContent =
        `Bem-vindo, ${user.name.split(" ")[0]}`;

    userInfoModal.querySelector(".modal-sub-title").textContent =
        user.email;

    userInfoModal
        .querySelector("#logoutBtn")
        .addEventListener("click", logout);
};

const checkSession = async () => {
    try {
        const res = await apiConnection.sendGetRequest("/session");

        if (!res || !res.name || !res.email) {
            throw new Error("Sessão inválida");
        }

        renderUserModal(res);
        localStorage.setItem("user-data",JSON.stringify(res));

    } catch {
        redirectToLogin();
    }
};

checkSession();

let profileCardOpened = false;
let notifyCardOpened = false;

const changePage = (pageUrl) => {
    return fetch(pageUrl).then(res => res.text()).then((res) => {
        contentBox.innerHTML = res;
    });
}

changePage("components/dashboard/dashboard.html").then((res) => {
    initializeDashboard(apiConnection);
});

changeButtons.forEach((bt, index) => {
    switch (index) {
        case 0:
            bt.addEventListener("click", () => {
                changePage("components/dashboard/dashboard.html").then((res) => {
                    initializeDashboard(apiConnection);
                });

            })
            break;
        case 1:
            bt.addEventListener("click", () => {
                changePage("components/finanças/finance.html").then((res)=>{
                    initializeFinances(apiConnection);
                });
            })
            break;
        case 2:
            bt.addEventListener("click", () => {
                changePage("components/vendas/sales.html").then((res) => {
                    initializeSales(apiConnection);
                });
            })
            break;
        case 3:
            bt.addEventListener("click", () => {
                changePage("components/clientes/clientes.html").then((res) => {
                    initializeClientes(apiConnection);
                })
            })
            break;
        case 4:
            bt.addEventListener("click", () => {
                changePage("components/estoque/estoque.html").then((res) => {
                    initializeEstoque(apiConnection);
                })
            })
            break;
        case 5:
            bt.addEventListener("click", () => {
                changePage("components/relatorios/relatorios.html").then((res) => {
                    initializeRelatorios();
                })
            })
            break;
        case 6:
            bt.addEventListener("click", () => {
                changePage("components/colaboradores/colaboradores.html").then((res) => {
                    initializeColaboradores(apiConnection);
                })
            })
            break;
    }
});

userProfileButton.addEventListener("click", (e) => {
    e.stopPropagation(); // impede o clique de subir pro document

    if (!profileCardOpened) {
        profileContainer.classList.add("expand");
        profileCardOpened = true;
    } else {
        closeProfile();
    }
});

notifyButton.addEventListener("click", () => {
    if (!notifyCardOpened && notifyContainer) {
        notifyContainer.classList.add("expand");
        notifyCardOpened = true;
    } else {
        closeNotifications();
    }
})

document.addEventListener("click", (e) => {
    if (
        profileCardOpened &&
        !profileContainer.contains(e.target) &&
        !userProfileButton.contains(e.target)
    ) {
        closeProfile();
    }

    if(notifyCardOpened &&
        !notifyContainer.contains(e.target)&&
        !notifyButton.contains(e.target)
    ){
        closeNotifications();
    }
});

function closeNotifications(){
    notifyContainer.classList.remove("expand");
    notifyCardOpened = false;
}
function closeProfile() {
    profileContainer.classList.remove("expand");
    profileCardOpened = false;
}