
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
        try{
            const res = await fetch(this.API_URL+endpoint,{
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(body),
                method: "POST"
            });

            const data = await res.json();

            if(!res.ok){
                const error = new Error(data.message || "erro na requisição");
                error.status = res.status;
                throw error;
            }

            return data;
        }catch(error){
            console.error("Error code: "+error.status);
            console.error(error.message);

            return {
            error: true,
            status: error.status || 500,
            message: error.message
        };
        }

    }
}