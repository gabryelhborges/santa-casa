import ItensBaixaDAO from "../persistencia/itensBaixaDAO.js"

export default class ItensBaixa{
    #baixa;
    #produto; //obj produto
    #motivo; //obj motivo
    #quantidade;
    #lote; //obj lote
    #unidade; //obj unidade
    #ib_idObservacao;
    
    constructor(baixa= null, produto= null, motivo= null, quantidade= 0, lote= null, unidade= null, ib_idObservacao=""){
        this.#baixa = baixa;
        this.#produto = produto;
        this.#motivo = motivo;
        this.#quantidade= quantidade;
        this.#lote = lote;
        this.#unidade = unidade;
        this.#ib_idObservacao = ib_idObservacao;
    }

    get produto() {
        return this.#produto;
    }

    set produto(value) {
        this.#produto = value;
    }

    // Motivo
    get motivo() {
        return this.#motivo;
    }

    set motivo(value) {
        this.#motivo = value;
    }

    // Quantidade
    get quantidade() {
        return this.#quantidade;
    }

    set quantidade(value) {
        this.#quantidade = value;
    }

    // Lote
    get lote() {
        return this.#lote;
    }

    set lote(value) {
        this.#lote = value;
    }

    // Unidade
    get unidade() {
        return this.#unidade;
    }

    set unidade(value) {
        this.#unidade = value;
    }

    // Ib_idObservacao
    get ib_idObservacao() {
        return this.#ib_idObservacao;
    }

    set ib_idObservacao(value) {
        this.#ib_idObservacao = value;
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

    async gravar(conexao){
        const icDao = new ItensBaixaDAO();
        await icDao.gravar(this, conexao);
    }

    async atualizar(conexao){
        const icDao = new ItensBaixaDAO();
        await icDao.atualizar(this, conexao);
    }

    async excluir(conexao){
        const icDao = new ItensBaixaDAO();
        await icDao.excluir(this, conexao);
    }

    async consultar(termo, conexao){
        const icDao = new ItensBaixaDAO();
        return await icDao.consultar(termo, conexao);
    }
}