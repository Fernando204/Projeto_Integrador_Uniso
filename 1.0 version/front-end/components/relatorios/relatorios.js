const active = (bt)=>{
    bt.style.transform = "scale(1.1)";
    activeButton.style.transform = "scale(1)";

    activeButton = bt;
}

const initialize = ()=>{
    const pagesButton = document.querySelectorAll(".navigation-button");
    let activeButton = pagesButton[0];

    pagesButton.forEach((bt,index)=>{
        console.log("foi")
        bt.addEventListener("click",()=>{
            active(bt);
            alert("foi")
        })
    })
}

initialize();