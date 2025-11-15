export class Entries {
    contructor(descricao,valor,type,data){
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
        this.type = type;
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
            type: this.type
        };
    }
}

