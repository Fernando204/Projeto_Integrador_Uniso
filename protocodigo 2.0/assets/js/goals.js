export class Goals{
    constructor(nome,valor,data,status){
        this.nome = nome;
        this.valor = valor;
        this.data = data;
        this.status = status;
    }

    getNome(){
        return this.nome;
    }
    getValor(){
        return this.valor;
    }
    getdata(){
        return this.data;
    }

    toString(){
        return {
            nome: this.nome,
            valor: this.valor,
            data: this.data,
            status: this.status
        };
    }
}