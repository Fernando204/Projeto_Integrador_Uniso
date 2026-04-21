
export class ApiConnection {
    API_URL = "http://localhost:8080";
    //AVNS_-4ZCK4v9cDwE6VXx0Zn

    async login(user) {
        const response = await this.sendPostRequest("/auth/login", user);
        return response;
    }

    async register(user) {
        const response = await this.sendPostRequest("/auth/register", user);
        return response;
    }

    async logout() {
        await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        // window.location.href = "Pages/loginPage.html";
        // location.href = "Pages/loginPage.html"
    }

    async sendGetRequest(endpoint) {
        try {
            const res = await fetch(endpoint, {
                credentials: "include"
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erro na requisição");
            }

            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
            return {
                "error": true,
                "message": error.message
            }
        };

    }

    async sendPatchRequest(endpoint){
        try {
            const res = await fetch(this.API_URL + endpoint, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (!res.ok) {
                const error = new Error(data.message || "erro na requisição");
                error.status = res.status;
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error code: " + error.status);
            console.error(error.message);

            return {
                error: true,
                status: error.status || 500,
                message: error.message
            };
        }
    }

    async sendPostRequest(endpoint, body) {
        try {
            const res = await fetch(this.API_URL + endpoint, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),

            });

            const data = await res.json();

            if (!res.ok) {
                const error = new Error(data.message || "erro na requisição");
                error.status = res.status;
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error code: " + error.status);
            console.error(error.message);

            return {
                error: true,
                status: error.status || 500,
                message: error.message
            };
        }

    }
}