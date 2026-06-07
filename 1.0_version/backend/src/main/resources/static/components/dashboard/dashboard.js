export async function initializeDashboard(api) {
    const saldoLabel    = document.querySelector(".saldo");
    const receitasLabel = document.querySelector(".receita");
    const despesasLabel = document.querySelector(".despesa");
    const lucroLabel    = document.querySelector(".lucro");

    const salesListContainer = document.getElementById("listContainer");
    const pendentBt    = document.getElementById("pendentBt");
    const notFaturedBt = document.getElementById("notFaturedBt");
    const item         = document.getElementById("item");

    const data = JSON.parse(localStorage.getItem("user-data"));

    // ----- Alternância de abas -----
    pendentBt.addEventListener("click", () => {
        pendentBt.classList.add("active-bt");
        notFaturedBt.classList.remove("active-bt");
        item.innerHTML = "Lista de vendas pendentes";
    });

    notFaturedBt.addEventListener("click", () => {
        pendentBt.classList.remove("active-bt");
        notFaturedBt.classList.add("active-bt");
        item.innerHTML = "Lista de vendas não faturadas";
    });

    // ----- Busca de dados -----
    const res = await api.sendGetRequest("/dashboard?companyId=" + data.companyId);

    if (res.error) {
        alert("Erro ao buscar dados!");
        return;
    }

    // ----- Atualiza labels com animação de contagem -----
    animateValue(saldoLabel,    0, res.balance,         1000, "R$");
    animateValue(receitasLabel, 0, res.monthlyRevenue,  1000, "R$");
    animateValue(despesasLabel, 0, -res.monthlyExpenses, 1000, "R$");
    animateValue(lucroLabel,    0, res.monthlyProfit,   1000, "R$");
}

/**
 * Anima o valor de um label de 0 até o valor final.
 * @param {HTMLElement} el     - Elemento alvo
 * @param {number}      start  - Valor inicial
 * @param {number}      end    - Valor final
 * @param {number}      duration - Duração em ms
 * @param {string}      suffix - Sufixo (ex: "R$")
 */
function animateValue(el, start, end, duration, suffix) {
    const startTime = performance.now();
    const negative = end < 0;
    const absEnd = Math.abs(end);

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easing suave
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (absEnd - start) * eased;

        const formatted = current.toFixed(2).replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        el.innerHTML = (negative ? "-" : "") + formatted + " " + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}