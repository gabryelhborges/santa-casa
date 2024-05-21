class ItensBaixa{
    #baixa;
    #produto; //obj produto
    #motivo; //obj motivo
    #quantidade;
    #lote; //obj lote
    #unidade; //obj unidade
    #ib_idObservacao;
    
    constructor(baixa= null, produto= null, motivo= "", quantidade= "", lote= "", unidade= "", ib_idObservacao=""){
        this.#baixa = baixa;
        this.#produto = produto;
        this.#motivo = motivo;
        this.#quantidade= quantidade;
        this.#lote = lote;
        this.#unidade = unidade;
        this.#ib_idObservacao = ib_idObservacao;
    }

    get baixa(){
        return this.#baixa;
    }
    set baixa(novoib_idBaixa){
        this.#baixa= novoib_idBaixa;
    }

    get produto(){
        return this.#produto;
    }
    set produto(novoproduto){
        this.#produto = novoproduto
    }

    get motivo(){
        return this.#motivo;
    }
    set motivo(novomotivo){
        this.#motivo = novomotivo;
    }

    get quantidade(){
        return this.#quantidade;
    }
    set quantidade(novoquantidade){
        this.#quantidade= novoquantidade;
    }

    get lote(){
        return this.#lote;
    }
    set lote(novolote){
        this.#lote = novolote;
    }

    get unidade(){
        return this.#unidade;
    }
    set unidade(novounidade){
        this.#unidade = novounidade;
    }

    get ib_idObservacao(){
        return this.#ib_idObservacao;
    }
    set ib_idObservacao(novoib_idObservacao){
        this.#ib_idObservacao = novoib_idObservacao;
    }

    toString(){

    }
    toJSON(){
        return {
            baixa: this.#baixa,
            produto: this.#produto,
            motivo: this.#motivo,
            quantidade: this.#quantidade,
            lote: this.#lote,
            unidade: this.#unidade,
            ib_idObservacao: this.#ib_idObservacao
        };
    }

}