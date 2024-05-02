class ItensConsumo{
    #consumo;
    #lote;
    #produto;
    #qtdeConteudoUtilizado;

    constructor(consumo= null, lote= null, produto= null, qtdeConteudoUtilizado= 0){
        this.#consumo= consumo;
        this.#lote= lote;
        this.#produto= produto;
        this.#qtdeConteudoUtilizado= qtdeConteudoUtilizado;
    }

    get consumo(){
        return this.#consumo;
    }
    set consumo(novoconsumo){
        this.#consumo= novoconsumo;
    }

    get lote(){
        return this.#lote;
    }
    set lote(novolote){
        this.#lote = novolote;
    }

    get produto(){
        return this.#produto;
    }
    set produto(novoproduto){
        this.#produto= novoproduto;
    }

    get qtdeConteudoUtilizado(){
        return this.#qtdeConteudoUtilizado;
    }
    set qtdeConteudoUtilizado(novoqtdeConteudoUtilizado){
        this.#qtdeConteudoUtilizado = novoqtdeConteudoUtilizado;
    }

    toJSON(){
        return {
            consumo: this.#consumo,
            lote: this.#lote,
            produto: this.#produto,
            qtdeConteudoUtilizado: this.#qtdeConteudoUtilizado
        };
    }
}