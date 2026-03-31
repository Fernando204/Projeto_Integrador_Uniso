let pagesButton;
let activeButton;

const active = (bt)=>{
    if(bt === activeButton) return;
    
    bt.classList.add("active-button");
    activeButton.classList.remove("active-button");

    activeButton = bt;
}

const changePage = (pageUrl,contentBox)=>{
    return fetch(pageUrl).then(res => res.text()).then((res) =>{
        contentBox.innerHTML = res;
    });
}

const initializeRelatorios = ()=>{

    pagesButton = document.querySelectorAll(".navigation-button");
    activeButton = pagesButton[0]
    activeButton.classList.add("active-button");

    pagesButton.forEach((bt,index)=>{
        console.log("foi")
        bt.addEventListener("click",()=>{
            active(bt);

            switch(index){
                case 0:
                    changePage("./components/relatorios/specific/sale.html",container).then(()=>{});   
                    break;
                case 1:
                    changePage("./components/relatorios/specific/finance.html",container).then(()=>{});
                    break;
                case 2:
                    changePage("./components/relatorios/specific/products.html",container).then(()=>{});   
                    break;
                case 3:
                    changePage("./components/relatorios/specific/estatisticas.html",container).then(()=>{});

            }
        })
    })

    const container = document.getElementById("contentContainer");
    changePage("./components/relatorios/specific/sale.html",container).then(()=>{});   

}