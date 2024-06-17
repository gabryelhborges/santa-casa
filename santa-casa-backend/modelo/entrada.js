import EntradaDAO from "../persistencia/EntradaDAO.js";

export default class Entrada{
    #entrada_id;
    #funcionario;
    #data_entrada;
    #itensEntrada;

    constructor(entrada_id = 0,funcionario = null ,data_entrada = "",itensEntrada = []){
        this.#entrada_id = entrada_id;
        this.#funcionario = funcionario;
        this.#data_entrada = data_entrada;
        this.#itensEntrada = itensEntrada;
    }

    get itensEntrada(){
        return this.#itensEntrada;
    }

    set itensEntrada(valor){
        this.#itensEntrada = valor;
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
            "data_entrada": this.data_entrada,
            "itensEntrada": this.itensEntrada
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

    async consultar2(prod,lote,conexao){
        const entradaDAO  = new EntradaDAO();
        return await  entradaDAO.consultar2(prod,lote,conexao);
    }

    async consultarTotal(idFun,inicio,fim,conexao){
        const entradaDAO  = new EntradaDAO();
        return await entradaDAO.consultarTotal(idFun,inicio,fim,conexao);
    }

    async consultarTotalItens(idFun,inicio,fim,conexao){
        const entradaDAO  = new EntradaDAO();
        return await entradaDAO.consultarTotalItens(idFun,inicio,fim,conexao);
    }

    async consultarUltima(idFun,inicio,fim,conexao){
        const entradaDAO  = new EntradaDAO();
        return await entradaDAO.consultarUltima(idFun,inicio,fim,conexao);
    }

    async consultarNovosLotes(idFun,inicio,fim,conexao){
        const entradaDAO  = new EntradaDAO();
        return await entradaDAO.consultarNovosLotes(idFun,inicio,fim,conexao);
    }
}