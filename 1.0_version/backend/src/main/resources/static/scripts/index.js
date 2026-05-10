import { initializeClientes } from "../components/clientes/clientes.js";
import { initializeColaboradores } from "../components/colaboradores/colaboradores.js";
import { initializeDashboard } from "../components/dashboard/dashboard.js";
import { initializeRelatorios } from "../components/relatorios/relatorios.js";
import { initializeSales } from "../components/vendas/Sales.js";
import { initializeFinances } from "../components/finanças/finance.js";
import { initializeEstoque } from "../components/estoque/estoque.js";
import { initializeConfiguracoes, loadSavedTheme } from "../components/configuracoes/configuracoes.js";
import { ApiConnection } from "./classes/ApiConnection.js";
import { Router } from "./classes/Router.js";

loadSavedTheme();

const userInfoModal = document.getElementById("user-info-modal");
const loginBt = document.getElementById("gotoLoginBt");
const contentBox = document.getElementById("site-content");
const changeButtons = document.querySelectorAll(".pageButton");
const userProfileButton = document.querySelector(".user-profile-button");
const notifyButton = document.querySelector(".notification-button");
const notifyContainer = document.querySelector(".notify-container");
const profileContainer = document.querySelector(".profile-container");
const navBar = document.getElementById("mainNavBar");
const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
const settingsNavBtn = document.getElementById("settingsNavBtn");
const mainHeader = document.getElementById("mainHeader");
const apiConnection = new ApiConnection();
const router = new Router(contentBox,apiConnection);
const SERVER_URL = "http://localhost:8080";

let logged = false;
let sidebarOpen = true;

function updateHeaderPosition() {
    if (mainHeader) {
        mainHeader.style.left = sidebarOpen
            ? "var(--sidebar-width)"
            : "var(--sidebar-collapsed-width)";
    }
    contentBox.style.marginLeft = sidebarOpen
        ? "var(--sidebar-width)"
        : "var(--sidebar-collapsed-width)";
}


sidebarToggleBtn.addEventListener("click", () => {
    sidebarOpen = !sidebarOpen;
    if (sidebarOpen) {
        navBar.classList.remove("sidebar-collapsed");
    } else {
        navBar.classList.add("sidebar-collapsed");
    }
    updateHeaderPosition();
});


function setActiveButton(index) {
    changeButtons.forEach(btn => btn.classList.remove("active"));
    if (changeButtons[index]) changeButtons[index].classList.add("active");
}


const redirectToLogin = () => {
    location.href = SERVER_URL+"/login";
};

window.addEventListener("popstate", () => {
    router.changeView(window.location.pathname);
});

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
        localStorage.setItem("user-data", JSON.stringify(res));
        logged = true;
        initializeMain();
    } catch {
        alert("sessão invalida");
        redirectToLogin();
    }
};
checkSession();

let profileCardOpened = false;
let notifyCardOpened = false;

function initializeMain() {
    if (!logged) {
        console.log("Não logado!");
        return;
    }
    contentBox.classList.remove("loading");
    router.changeView("/");

    // Nav buttons
    changeButtons.forEach((bt, index) => {
        bt.addEventListener("click",()=>{
            router.changeView(bt.dataset.id);
        })
    });

    settingsNavBtn.addEventListener("click", () => {
        changePage("components/configuracoes/configuracoes.html").then(() => {
            initializeConfiguracoes();
        });
    });

    userProfileButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!profileCardOpened) {
            profileContainer.classList.add("expand");
            profileCardOpened = true;
        } else {
            closeProfile();
        }
    });

    notifyButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!notifyCardOpened && notifyContainer) {
            notifyContainer.classList.add("expand");
            notifyCardOpened = true;
        } else {
            closeNotifications();
        }
    });

    document.addEventListener("click", (e) => {
        if (
            profileCardOpened &&
            !profileContainer.contains(e.target) &&
            !userProfileButton.contains(e.target)
        ) {
            closeProfile();
        }

        if (
            notifyCardOpened &&
            !notifyContainer.contains(e.target) &&
            !notifyButton.contains(e.target)
        ) {
            closeNotifications();
        }
    });

    function closeNotifications() {
        notifyContainer.classList.remove("expand");
        notifyCardOpened = false;
    }

    function closeProfile() {
        profileContainer.classList.remove("expand");
        profileCardOpened = false;
    }
}
