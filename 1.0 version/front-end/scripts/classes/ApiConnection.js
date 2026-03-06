
export class ApiConnection{
    API_URL = "http://localhost:8080";

    login(user){
        response = this.sendPostRequest("/auth/login",user)
        return response;
    }

    register(user){
        response = this.sendPostRequest("/auth/register",user)
        return response;
    }

    async sendPostRequest(endpoint, body){
        let status = null;
        let message = null;

        try{

        }catch(err){

        }

        return {
            status: status,
            message: message
        }
    }
}