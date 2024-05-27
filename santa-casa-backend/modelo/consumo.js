import ConsumoDAO from "../persistencia/consumoDAO.js";

export default class Consumo{
    #idConsumo;
    #paciente;//objeto paciente
    #funcionario;//objeto funcionario
    #local;
    #itensConsumo;//lista de produtos utilizados
    #dataConsumo;
    
    constructor(idConsumo= 0, paciente= null, funcionario= null, local= null, itensConsumo= [], dataConsumo= ""){
        this.#idConsumo = idConsumo;
        this.#paciente = paciente;
        this.#funcionario = funcionario;
        this.#local= local;
        this.#itensConsumo = itensConsumo;
        this.#dataConsumo = dataConsumo;
    }

    get idConsumo(){
        return this.#idConsumo;
    }
    set idConsumo(novoidConsumo){
        this.#idConsumo= novoidConsumo;
    }

    get paciente(){
        return this.#paciente;
    }
    set paciente(novopaciente){
        this.#paciente = novopaciente
    }

    get funcionario(){
        return this.#funcionario;
    }
    set funcionario(novofuncionario){
        this.#funcionario = novofuncionario;
    }

    get local(){
        return this.#local;
    }
    set local(novolocal){
        this.#local= novolocal;
    }

    get itensConsumo(){
        return this.#itensConsumo;
    }
    set itensConsumo(novoitensConsumo){
        this.#itensConsumo = novoitensConsumo;
    }

    get dataConsumo(){
        return this.#dataConsumo;
    }
    set dataConsumo(novodataConsumo){
        this.#dataConsumo = novodataConsumo;
    }

    toString(){

    }
    toJSON(){
        return {
            idConsumo: this.#idConsumo,
            paciente: this.#paciente,
            funcionario: this.#funcionario,
            local: this.#local,
            itensConsumo: this.#itensConsumo,
            dataConsumo: this.#dataConsumo
        };
    }

    async gravar(conexao){
        const consDAO = new ConsumoDAO();
        await consDAO.gravar(this, conexao);
    }

    async atualizar(conexao){
        const consDAO = new ConsumoDAO();
        await consDAO.atualizar(this, conexao);
    }

    async excluir(conexao){
        const consDAO = new ConsumoDAO();
        await consDAO.excluir(this, conexao);
    }

    async consultar(conexao){
        const consDAO = new ConsumoDAO();
        return await consDAO.consultar(this, conexao);
    }
}