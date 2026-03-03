const contentBox = document.getElementById("site-content");

const changeButtons = document.querySelectorAll(".pageButton");

const changePage = (pageUrl)=>{
    fetch(pageUrl).then(res => res.text()).then((res) =>{
        contentBox.innerHTML = res;
    });
}

changePage("components/dashboard/dashboard.html");

changeButtons.forEach((bt,index) =>{
    switch(index){
        case 0:
            bt.addEventListener("click",()=>{
                changePage("components/dashboard/dashboard.html");
            })
            break;
        case 1:
            bt.addEventListener("click",()=>{
                changePage("components/finanças/finance.html");
            })
            break;
    }
})