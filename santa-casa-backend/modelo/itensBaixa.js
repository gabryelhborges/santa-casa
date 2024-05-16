import ItensBaixaDAO from "../persistencia/itensBaixaDAO.js"

export default class ItensBaixa{
    #ib_idBaixa;
    #produto; //objeto produto
    #ib_idMotivo;
    #ib_idQtde;
    #ib_idLote;
    #ib_idUnidade;
    #ib_idObservacao;
    
    constructor(ib_idBaixa= 0, produto= null, ib_idMotivo= "", ib_idQtde= "", ib_idLote= "", ib_idUnidade= "", ib_idObservacao=""){
        this.#ib_idBaixa = ib_idBaixa;
        this.#produto = produto;
        this.#ib_idMotivo = ib_idMotivo;
        this.#ib_idQtde= ib_idQtde;
        this.#ib_idLote = ib_idLote;
        this.#ib_idUnidade = ib_idUnidade;
        this.#ib_idObservacao = ib_idObservacao;
    }

    get ib_idBaixa(){
        return this.#ib_idBaixa;
    }
    set ib_idBaixa(novoib_idBaixa){
        this.#ib_idBaixa= novoib_idBaixa;
    }

    get produto(){
        return this.#produto;
    }
    set produto(novoproduto){
        this.#produto = novoproduto
    }

    get ib_idMotivo(){
        return this.#ib_idMotivo;
    }
    set ib_idMotivo(novoib_idMotivo){
        this.#ib_idMotivo = novoib_idMotivo;
    }

    get ib_idQtde(){
        return this.#ib_idQtde;
    }
    set ib_idQtde(novoib_idQtde){
        this.#ib_idQtde= novoib_idQtde;
    }

    get ib_idLote(){
        return this.#ib_idLote;
    }
    set ib_idLote(novoib_idLote){
        this.#ib_idLote = novoib_idLote;
    }

    get ib_idUnidade(){
        return this.#ib_idUnidade;
    }
    set ib_idUnidade(novoib_idUnidade){
        this.#ib_idUnidade = novoib_idUnidade;
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
            ib_idBaixa: this.#ib_idBaixa,
            produto: this.#produto,
            ib_idMotivo: this.#ib_idMotivo,
            ib_idQtde: this.#ib_idQtde,
            ib_idLote: this.#ib_idLote,
            ib_idUnidade: this.#ib_idUnidade,
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