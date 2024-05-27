import ItensEntradaDAO from "../persistencia/itensEntradaDAO.js";

export default class ItensEntrada{
    #entrada;
    #lote;
    #produto;
    #quantidade;

    constructor( entrada = null, lote = null, produto = null, quantidade = 0){
        this.lote = lote;
        this.entrada = entrada;
        this.produto = produto;
        this.quantidade = quantidade;
    }

    get produto(){
        return this.#produto;
    }

    set produto(valor){
        this.#produto = valor;
    }

    get lote(){
        return this.#lote;
    }

    set lote(valor){
        this.#lote = valor;
    }

    get entrada(){
        return this.#entrada;
    }

    set entrada(valor){
        this.#entrada = valor;
    }

    get quantidade(){
        return this.#quantidade;
    }

    set quantidade(valor){
        this.#quantidade = valor;
    }

    toJSON(){
        return {
            "entrada": this.entrada,
            "lote": this.lote,
            "produto": this.produto,
            "quantidade": this.quantidade
        };
    }

    async gravar(conexao){
        const itensEnradaDAO = new ItensEntradaDAO();
        await itensEnradaDAO.gravar(this, conexao);
    }

    async atualizar(conexao){
        const itensEnradaDAO = new ItensEntradaDAO();
        await itensEnradaDAO.atualizar(this, conexao);
    }

    async excluir(conexao){
        const itensEnradaDAO = new ItensEntradaDAO();
        await itensEnradaDAO.excluir(this, conexao);
    }

    async consultar(conexao){
        const itensEnradaDAO = new ItensEntradaDAO();
        return await itensEnradaDAO.consultar(this, conexao);
    } 
}