import LoteDAO from "../persistencia/loteDAO.js";

export default class Lote{
    #codigo;
    #data_validade;
    #quantidade;
    #produto;
    #formaFarmaceutica;
    #conteudo_frasco;
    #unidade;
    #total_conteudo;
    #local;

    constructor(codigo = "" ,
                data_validade = "",
                quantidade = 0,
                produto = null, 
                formaFarmaceutica = null,
                conteudo_frasco = 0,
                unidade = null,
                total_conteudo = 0,
                local= null
    ){
        this.#codigo = codigo;
        this.#data_validade = data_validade;
        this.#quantidade = quantidade;
        this.#produto = produto;
        this.#formaFarmaceutica = formaFarmaceutica;
        this.#conteudo_frasco = conteudo_frasco;
        this.#unidade = unidade;
        this.#total_conteudo = total_conteudo;
        this.#local = local;
    }

    get codigo(){
        return this.#codigo;
    }

    set  codigo(novo){
        this.#codigo = novo;
    }
    
    get data_validade(){
        return this.#data_validade
    }

    set data_validade(novo){
        this.#data_validade = novo;
    }

    get  quantidade() {
        return this.#quantidade;
    }

    set quantidade (novo) {
        this.#quantidade = novo;
    }

    get  produto () {
        return this.#produto;
    }

    set produto (novoProduto) {
        this.#produto = novoProduto;
    }

    get   formaFarmaceutica () {
        return this.#formaFarmaceutica;
    }

    set formaFarmaceutica(novo){
        this.#formaFarmaceutica = novo;
    }

    get conteudo_frasco(){
        return this.#conteudo_frasco;
    }

    set  conteudo_frasco(novosConteudos){
        this.#conteudo_frasco = novosConteudos;
    }

    get unidade(){
        return this.#unidade;
    }

    set unidade(novo){
        this.#unidade = novo;
    }

    get total_conteudo(){
        return this.#total_conteudo;
    }

    set total_conteudo(novo){
        this.#total_conteudo= novo;
    }

    get local(){
        return this.#local;
    }

    set local(novo){
        this.#local = novo;
    }

    toJSON(){
        return{
            codigo: this.#codigo,
            data_validade: this.#data_validade,
            quantidade: this.#quantidade,
            produto: this.#produto,
            formaFarmaceutica: this.#formaFarmaceutica,
            conteudo_frasco: this.#conteudo_frasco,
            unidade: this.#unidade,
            total_conteudo: this.#total_conteudo,
            local: this.#local
        };
    }

    async gravar(){
        const loteDAO = new LoteDAO();
        await loteDAO.gravar(this);
    }

    async atualizar(conexao){
        const  loteDAO = new LoteDAO();
        await loteDAO.atualizar(this,conexao);
    }

    async excluir(){
        const  loteDAO = new LoteDAO();
        await loteDAO.excluir(this);
    }

    async consultar(){
        const  loteDAO = new LoteDAO();
        return await loteDAO.consultar(this);
    }

    async verificarExistenciaLote(){
        const  loteDAO = new LoteDAO();
        return await loteDAO.verificarExistenciaLote(this);
    }
}