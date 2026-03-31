const initializeSales =()=>{
    const titleInfo = document.getElementById("titleInfo");
    const dataTitle = document.getElementById("dataTitle");

    const activateItens = document.querySelectorAll(".activate-item");
    const blocks = document.querySelectorAll(".block");
    const openBt = document.getElementById("openButton");

    let opened = false

    openBt.addEventListener("click",()=>{
        if (!opened) {
            const data = new Date();

            titleInfo.classList.remove("closed");
            titleInfo.classList.add("opened");
        
            dataTitle.classList.remove("closed");
            dataTitle.classList.add("opened");

            titleInfo.innerHTML = "Caixa Aberto";
            dataTitle.innerHTML = data.toLocaleDateString('pt-BR',{
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            openBt.innerText = "Fechar caixa";

            activateItens.forEach((bt,id)=>{
                bt.disabled = false;
                if(blocks[id]) blocks[id].style.opacity = "1";
            })
            opened = true;
        }else{
            titleInfo.classList.remove("opened");
            titleInfo.classList.add("closed");
        
            dataTitle.classList.remove("opened");
            dataTitle.classList.add("closed");

            titleInfo.innerHTML = "Caixa Fechado";
            dataTitle.innerHTML = "";

            openBt.innerText = "Abrir caixa";

            activateItens.forEach((bt,id)=>{
                bt.disabled = true;
                if(blocks[id]) blocks[id].style.opacity = "0.5";
            })
            opened = false;
        }
        
    })
}