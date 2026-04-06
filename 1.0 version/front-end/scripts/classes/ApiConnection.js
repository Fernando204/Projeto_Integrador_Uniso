
export class ApiConnection{
    API_URL = "http://localhost:8080";

    async login(user) {
        const response = await this.sendPostRequest("/auth/login", user);
        return response;
    }

    async register(user) {
        const response = await this.sendPostRequest("/auth/register", user);
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