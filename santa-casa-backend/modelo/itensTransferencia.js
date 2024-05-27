import ItensTransferenciaDAO from "../persistencia/itensTransferenciaDAO.js";

export default class ItensTransferencia{
    #transf_id;
    #prod_cod;
    #lote_cod;
    #quantidade;

    constructor(transf_id = null, prod_cod=null, lote_cod=null,quantidade=null){
        this.#transf_id = transf_id;
        this.#prod_cod = prod_cod;
        this.#lote_cod = lote_cod;
        this.#quantidade = quantidade;
    }
    get transf_id(){
        return this.#transf_id;
    }
    set transf_id(novo){
        this.#transf_id = novo;
    }

    get prod_cod(){
        return this.#prod_cod;
    }
    set prod_cod(novo){
        this.#prod_cod = novo;
    }

    get lote_cod(){
        return this.#lote_cod;
    }
    set lote_cod(novo){
        this.#lote_cod = novo;
    } 

    get quantidade(){
        return this.#quantidade;
    }
    set quantidade(novo){
        this.#quantidade = novo;
    }

    toJSON(){
        return {
            transf_id: this.#transf_id,
            prod_cod: this.#prod_cod,
            lote_cod: this.#lote_cod,
            quantidade: this.#quantidade
        }
    }
    async gravar(conexao){
        const itDAO = new ItensTransferenciaDAO();
        await itDAO.gravar(this,conexao);
    }

    async atualizar(conexao){
        const itDAO = new ItensTransferenciaDAO();
        await itDAO.atualizar(this,conexao);
    }

    async excluir(conexao){
        const itDAO = new ItensTransferenciaDAO();
        await itDAO.excluir(this, conexao);
    }
    
    async consultar(conexao){
        const itDAO = new ItensTransferenciaDAO();
        return await itDAO.consultar(this,conexao);
    }
}