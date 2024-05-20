import TransferenciaDAO from "../persistencia/transferenciaDAO.js";

export default class Transferencia{
    #itf_transf_id;
    #itf_lote_cod;
    #itf_qtdetransferida;
    #itf_unidade;
    #itf_origem;
    #itf_destino;

    constructor(itf_transf_id, itf_lote_cod, itf_qtdetransferida, itf_unidade, itf_origem, itf_destino){
        this.#itf_transf_id=itf_transf_id;
        this.#itf_lote_cod=itf_lote_cod;
        this.#itf_qtdetransferida=itf_qtdetransferida;
        this.#itf_unidade = itf_unidade;
        this.#itf_origem = itf_origem;
        this.#itf_destino = itf_destino;
    }
    
    get itf_transf_id(){
        return this.#itf_transf_id;
    }
    set itf_transf_id(novo){
        this.#itf_transf_id=novo;
    }

    get itf_lote_cod(){
        return this.#itf_lote_cod;
    }
    set itf_lote_cod(novo){
        this.#itf_lote_cod = novo;
    }

    get itf_qtdetransferida(){
        return this.#itf_qtdetransferida;
    }
    set itf_qtdetransferida(novo){
        this.#itf_qtdetransferida = novo;
    }

    get itf_unidade(){
        return this.#itf_unidade;
    }
    set itf_unidade(novo){
        this.#itf_unidade = novo;
    }

    get itf_origem(){
        return this.#itf_origem;
    }
    set itf_origem(novo){
        this.#itf_origem = novo;
    }
    
    get itf_destino(){
        return this.#itf_destino;
    }
    set itf_destino(novo){
        this.#itf_destino = novo;
    }

    toString(){

    }
    toJSON(){
        return{
            itf_transf_id: this.#itf_transf_id,
            itf_lote_cod: this.#itf_lote_cod,
            itf_qtdetransferida: this.#itf_qtdetransferida,
            itf_unidade: this.#itf_unidade,
            itf_origem: this.#itf_origem,
            itf_destino: this.#itf_destino
        }
    }

    async gravar(conexao){
        const itfDAO = new TransferenciaDAO();
        await itfDAO.gravar(this,conexao);
    }
    async atualizar(conexao){
        const itfDAO = new TransferenciaDAO();
        await itfDAO.atualizar(this,conexao);
    }
    async excluir(conexao){
        const itfDAO = new TransferenciaDAO();
        await itfDAO.excluir(this,conexao);
    }
    async consultar(termo,conexao){
        const itfDAO = new TransferenciaDAO();
        return await itfDAO.consultar(termo,conexao);
    }
}