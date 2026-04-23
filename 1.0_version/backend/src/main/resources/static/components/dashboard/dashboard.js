export async function initializeDashboard(api){
    const saldoLabel = document.querySelector(".saldo");
    const receitasLabel = document.querySelector(".receita");
    const despesasLabel = document.querySelector(".despesa");
    const lucroLabel = document.querySelector(".lucro");

    const salesListContainer = document.getElementById("listContainer");//containter onde são mostradas as vendas pendentes e as não faturadas
    const pendentBt = document.getElementById("pendentBt");//botão para mostrar vendas pendentes
    const notFaturedBt = document.getElementById("notFaturedBt");//botão para mostrar as vendas não faturadas
    const item = document.getElementById("item");//item para mostrar qual lista está

    const data = JSON.parse(localStorage.getItem("user-data"));//Pega do localStorage as informações sobre o usuário como id da empresa e o id do usuário em si

    pendentBt.addEventListener("click",()=>{
        pendentBt.classList.add("active-bt");
        notFaturedBt.classList.remove("active-bt");

        item.innerHTML = "Lista de vendas pendentes"
    })
    notFaturedBt.addEventListener("click",()=>{
        pendentBt.classList.remove("active-bt");
        notFaturedBt.classList.add("active-bt");

        item.innerHTML = "Lista de vendas não faturadas"
    })

    const res = await api.sendGetRequest("/dashboard?companyId="+data.companyId);

    if(res.error){
        alert("Erro ao buscar dados!");
        return;
    }

    saldoLabel.innerHTML = res.balance.toFixed(2).replace(".",",")+" R$";
    receitasLabel.innerHTML = res.monthlyRevenue.toFixed(2).replace(".",",")+" R$";
    despesasLabel.innerHTML = "-"+res.monthlyExpenses.toFixed(2).replace(".",",")+" R$";
    lucroLabel.innerHTML = res.monthlyProfit.toFixed(2).replace(".",",")+" R$";

}