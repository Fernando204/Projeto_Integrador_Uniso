import { initializeClientes } from "../../components/clientes/clientes.js";
import { initializeColaboradores } from "../../components/colaboradores/colaboradores.js";
import { initializeDashboard } from "../../components/dashboard/dashboard.js";
import { initializeRelatorios } from "../../components/relatorios/relatorios.js";
import { initializeSales } from "../../components/vendas/Sales.js";
import { initializeFinances } from "../../components/finanças/finance.js";
import { initializeEstoque } from "../../components/estoque/estoque.js";
import { initializeConfiguracoes, loadSavedTheme } from "../../components/configuracoes/configuracoes.js";
import { ApiConnection } from "./ApiConnection.js";

export class Router {
    api = null;
    container = null;

    constructor(container, api) {
        this.container = container;
        this.api = api;
    }

    routes = {
        "/": {
            path: "components/dashboard/dashboard.html",
            function: () => {
                initializeDashboard(this.api);
            }
        },
        "/dashboard": {
            path: "components/dashboard/dashboard.html",
            function: () => {
                initializeDashboard(this.api);
            }
        },
        "/financas": {
            path: "components/finanças/finance.html",
            function: () => {
                initializeFinances(this.api);
            }
        },
        "/vendas": {
            path: "components/vendas/sales.html",
            function: () => {
                initializeSales(this.api);
            }
        },
        "/clientes":{
            path: "components/clientes/clientes.html",
            function: () => {
                initializeClientes(this.api);
            }
        },
        "/estoque":{
            path: "components/estoque/estoque.html",
            function: () => {
                initializeEstoque(this.api);
            }
        },
        "/relatorios":{
            path: "components/relatorios/relatorios.html",
            function: () => {
                initializeRelatorios(this.api);
            }
        },
        "/colaboradores":{
            path:"components/colaboradores/colaboradores.html",
            function: () => {
                initializeColaboradores(this.api);
            }
        },
        "/configuraçoes":{
            path: "components/configuracoes/configuracoes.html",
            function:()=>{
                initializeConfiguracoes();  
            }
        }
    }

    async changeView(pageUrl) {
        const route = this.routes[pageUrl];

        if (!route) {
            console.error("Rota não encontrada");
            return;
        }

        const res = await fetch(route.path);
        const html = await res.text();

        this.container.innerHTML = html;

        if (route.function) {
            route.function();
        }
    }

}