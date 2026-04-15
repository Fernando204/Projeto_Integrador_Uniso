export const initializeDashboard = ()=>{
    const salesListContainer = document.getElementById("listContainer");
    const pendentBt = document.getElementById("pendentBt");
    const notFaturedBt = document.getElementById("notFaturedBt");
    const item = document.getElementById("item");

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
}