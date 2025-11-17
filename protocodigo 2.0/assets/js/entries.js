export class Entries {
    constructor(descricao ,valor, type, data, user){
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
        this.type = type;
        this.user = user;
        console.log("Entry criado: "+ this.toString());
    }

    getDescricao() {
        return this.descricao;
    }
    getValor(){
        return this.valor;
    }
    getType(){
        return type;
    }

    toString(){
        return {
            descricao: this.descricao,
            valor: this.valor,
            data: this.data,
            type: this.type,
            user: this.user
        };
    }
}

