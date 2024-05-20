import EntradaDAO from "../persistencia/EntradaDAO.js";

export default class Entrada{
    #entrada_id
    #funcionario
    #data_entrada

    constructor(entrada_id = 0,funcionario = null ,data_entrada = ""){
        this.#entrada_id = entrada_id;
        this.#funcionario = funcionario;
        this.#data_entrada = data_entrada;
    }

    get entrada_id(){
        return  this.#entrada_id;
    }

    set entrada_id(valor){
        this.#entrada_id = valor;
    }

    get funcionario(){
        return this.#funcionario;
    }

    set funcionario(valor){
        this.#funcionario = valor;
    }

    get  data_entrada(){
        return this.#data_entrada;
    }
    
    set data_entrada(valor) {
        this.#data_entrada = valor;
    }

    toJSON(){
        return{
            "entrada_id" : this.entrada_id ,
            "funcionario": this.funcionario,
            "data_entrada": this.data_entrada
        };
    }

    async gravar(conexao){
        const entradaDAO = new EntradaDAO();
        await  entradaDAO.gravar(this,conexao);
    }

    async atualizar(conexao){
        const entradaDAO = new EntradaDAO() ;
        await entradaDAO.atualizar(this,conexao);
    }

    async excluir(conexao){
        const  entradaDAO=new EntradaDAO();
        await entradaDAO.excluir(this,conexao);
    }

    async consultar(termo,conexao){
        const entradaDAO  = new EntradaDAO();
        return await  entradaDAO.consultar(termo,conexao);
    }
}