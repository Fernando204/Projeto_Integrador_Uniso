export async function initializeDashboard(api) {
    const saldoLabel    = document.querySelector(".saldo");
    const receitasLabel = document.querySelector(".receita");
    const despesasLabel = document.querySelector(".despesa");
    const lucroLabel    = document.querySelector(".lucro");

    const salesListContainer = document.getElementById("listContainer");
    const pendentBt    = document.getElementById("pendentBt");
    const notFaturedBt = document.getElementById("notFaturedBt");

    const data = JSON.parse(localStorage.getItem("user-data"));

    // ----- Dados hardcoded de exemplo -----
    const vendasPendentes = [
        { nome: "Ração Premium 15kg",    valor: "R$ 230,00"   },
        { nome: "Suplemento Equino",     valor: "R$ 89,90"    },
        { nome: "Ferradura (jogo)",      valor: "R$ 160,00"   },
        { nome: "Feno Coastcross",       valor: "R$ 75,00"    },
        { nome: "Vermífugo Ivermectina", valor: "R$ 42,50"    },
    ];

    const vendasNaoFaturadas = [
        { nome: "Sela de Couro",       valor: "R$ 1.800,00" },
        { nome: "Cabeçada com Freio",  valor: "R$ 340,00"   },
        { nome: "Manta de Pelo",       valor: "R$ 95,00"    },
        { nome: "Corda de Laço 30m",   valor: "R$ 120,00"   },
    ];

    function renderVendas(lista) {
        salesListContainer.innerHTML = lista.map(v => `
            <div class="venda-item">
                <span class="nome-item">${v.nome}</span>
                <span class="valor-item">${v.valor}</span>
            </div>
        `).join("");
    }

    // Renderiza pendentes por padrão (aba inicial)
    renderVendas(vendasPendentes);

    // ----- Alternância de abas -----
    pendentBt.addEventListener("click", () => {
        pendentBt.classList.add("active-bt");
        notFaturedBt.classList.remove("active-bt");
        renderVendas(vendasPendentes);
    });

    notFaturedBt.addEventListener("click", () => {
        pendentBt.classList.remove("active-bt");
        notFaturedBt.classList.add("active-bt");
        renderVendas(vendasNaoFaturadas);
    });

    // ----- Busca de dados -----
    const res = await api.sendGetRequest("/dashboard?companyId=" + data.companyId);

    if (res.error) {
        alert("Erro ao buscar dados!");
        return;
    }

    // ----- Atualiza labels com animação de contagem -----
    animateValue(saldoLabel,    0, res.balance,          1000, "R$");
    animateValue(receitasLabel, 0, res.monthlyRevenue,   1000, "R$");
    animateValue(despesasLabel, 0, -res.monthlyExpenses, 1000, "R$");
    animateValue(lucroLabel,    0, res.monthlyProfit,    1000, "R$");
}

/**
 * Anima o valor de um label de 0 até o valor final.
 * @param {HTMLElement} el       - Elemento alvo
 * @param {number}      start    - Valor inicial
 * @param {number}      end      - Valor final
 * @param {number}      duration - Duração em ms
 * @param {string}      suffix   - Sufixo (ex: "R$")
 */
function animateValue(el, start, end, duration, suffix) {
    const startTime = performance.now();
    const negative = end < 0;
    const absEnd = Math.abs(end);

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (absEnd - start) * eased;

        const formatted = current.toFixed(2).replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        el.innerHTML = (negative ? "-" : "") + formatted + " " + suffix;

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}