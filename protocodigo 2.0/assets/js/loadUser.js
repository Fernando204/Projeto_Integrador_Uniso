const userInfo = JSON.parse(localStorage.getItem("loggedUser"));

if(!userInfo){
    console.log("Nenhum usuário logado");
    console.log(userInfo);
    // window.location.href = "../index.html";
}else{
    console.log("Usuário logado: "+userInfo.name);
}