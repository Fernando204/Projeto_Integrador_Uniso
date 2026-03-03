const db = localStorage.getItem("microgestor");
const userInfo = db ? JSON.parse(db).loggedUser : null;

if(!userInfo || userInfo === ""){
    console.log("Nenhum usuário logado");
    console.log(userInfo);
    window.location.href = "../index.html";
}else{
    console.log("Usuário logado: "+userInfo.name);
    console.log(userInfo);
    window.userInfo = userInfo;
}