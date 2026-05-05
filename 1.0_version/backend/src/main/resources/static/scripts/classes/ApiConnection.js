
export class ApiConnection {
    API_URL = "http://localhost:8080";

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

    async sendDeleteRequest(endpoint) {
        try {
            const res = await fetch(endpoint, {
                credentials: "include",
                method: "DELETE"
            });

            let data = null;

            // só tenta ler JSON se tiver conteúdo
            const text = await res.text();
            if (text) {
                data = JSON.parse(text);
            }

            if (!res.ok) {
                throw new Error(data?.message || "Erro na requisição");
            }

            return data;
        } catch (error) {
            console.log(error);
            return {
                error: true,
                message: error.message
            };
        }
    }

    async sendPatchRequest(endpoint) {
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