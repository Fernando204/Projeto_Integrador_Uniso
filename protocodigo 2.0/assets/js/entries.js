export class Entries {
    contructor(descricao,valor,type){
        this.descricao = descricao;
        this.valor = valor;
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
            type: this.type
        };
    }
}

