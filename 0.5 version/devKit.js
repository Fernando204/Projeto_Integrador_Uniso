import { Repository } from "./assets/js/Repository.js";

const repository = new Repository();
repository.setLoggedUser("");
repository.deleteUserByName("teste")
console.log("Carregando usuários do repositório...");
try {
    let users = repository.getAllUsers();
    console.log(users);
} catch (error) {
    console.error("Erro ao carregar usuários:", error);
}

repository.deleteAllUsers();