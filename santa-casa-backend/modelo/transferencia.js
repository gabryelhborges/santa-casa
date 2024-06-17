import TransferenciaDAO from "../persistencia/transferenciaDAO.js";

export default class Transferencia{
    #tf_id;
    #tf_data;
    #func_id;
    #tf_origem;
    #tf_destino;
    #itensTransferencia;

    constructor(tf_id = 0, tf_data = "", func_id = null, tf_origem = null, tf_destino = null,itensTransferencia = []){
        this.#tf_id=tf_id;
        this.#tf_data=tf_data;
        this.#func_id=func_id;
        this.#tf_origem = tf_origem;
        this.#tf_destino = tf_destino;
        this.#itensTransferencia = itensTransferencia;
    }
    
    get tf_id(){
        return this.#tf_id;
    }
    set tf_id(novo){
        this.#tf_id=novo;
    }

    get tf_data(){
        return this.#tf_data;
    }
    set tf_data(novo){
        this.#tf_data = novo;
    }

    get func_id(){
        return this.#func_id;
    }
    set func_id(novo){
        this.#func_id = novo;
    }

    get tf_origem(){
        return this.#tf_origem;
    }
    set tf_origem(novo){
        this.#tf_origem = novo;
    }
    
    get tf_destino(){
        return this.#tf_destino;
    }
    set tf_destino(novo){
        this.#tf_destino = novo;
    }

    get itensTransferencia(){
        return this.#itensTransferencia;
    }
    set itensTransferencia(novo){
        this.#itensTransferencia = novo;
    }

    toString(){

    }
    toJSON(){
        return{
            tf_id: this.#tf_id,
            tf_data: this.#tf_data,
            func_id: this.#func_id,
            itf_origem: this.#tf_origem,
            itf_destino: this.#tf_destino,
            itensTransferencia: this.#itensTransferencia
        }
    }

    async gravar(conexao){
        const itfDAO = new TransferenciaDAO();
        await itfDAO.gravar(this,conexao);
    }
    async excluir(conexao){
        const itfDAO = new TransferenciaDAO();
        await itfDAO.excluir(this,conexao);
    }
    async consultar(termo,conexao){
        const itfDAO = new TransferenciaDAO();
        return await itfDAO.consultar(termo,conexao);
    }

    async getperiodos(conexao, data1, data2){
        const itfDAO = new TransferenciaDAO();
        return await itfDAO.getperiodos(conexao,data2,data1);
    }
    async getantigos(conexao, data1){
        const itfDAO = new TransferenciaDAO();
        return await itfDAO.getantigos(conexao,data1);
    }
}