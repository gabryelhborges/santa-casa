import ProdutoDAO from "../persistencia/produtoDAO.js";

export default class Produto {
    #prod_ID
    #fabricante //obj fabricante
    #nome
    #psicotropico
    #valor_custo
    #nomeFar //Obj Nome Farmacológico
    #observacao
    #descricao_uso
    #tipo
    #unidade //Obj Unidade
    

    constructor(prod_ID=0,fabricante=null,nome="",psicotropico="",valor_custo=0,nomeFar=null,observacao="", descricao_uso="", tipo="", unidade =null) {
        this.#prod_ID = prod_ID;
        this.#fabricante = fabricante;
        this.#nome = nome;
        this.#psicotropico = psicotropico;
        this.#valor_custo = valor_custo;
        this.#nomeFar = nomeFar;
        this.#observacao = observacao;
        this.#descricao_uso= descricao_uso; 
        this.#tipo = tipo;
        this.#unidade  = unidade;
    }

    // getter for prod_ID
    get prod_ID() {
        return this.#prod_ID;
    }

  // setter for prod_ID
    set prod_ID(value) {
    this.#prod_ID = value;
    }

    // getter for fabricante
    get fabricante() {
    return this.#fabricante;
    }

    // setter for fabricante
    set fabricante(value) {
    this.#fabricante = value;
    }

    // getter for nome
    get nome() {
    return this.#nome;
    }

    // setter for nome
    set nome(value) {
        this.#nome = value;
    }

    // getter for psicotropico
    get psicotropico() {
        return this.#psicotropico;
    }

    // setter for psicotropico
    set psicotropico(value) {
        this.#psicotropico = value;
    }

    // getter for valor_custo
    get valor_custo() {
        return this.#valor_custo;
    }

    // setter for valor_custo
    set valor_custo(value) {
        this.#valor_custo = value;
    }

    // getter for nomeFar
    get nomeFar() {
        return this.#nomeFar;
    }

    // setter for nomeFar
    set nomeFar(value) {
        this.#nomeFar = value;
    }
    // getter for observacao
    get observacao() {
        return this.#observacao;
    }

    // setter for observacao
    set observacao(value) {
        this.#observacao = value;
    }

    // getter for descricao_uso
    get descricao_uso() {
        return this.#descricao_uso;
    }

    // setter for descricao_uso
    set descricao_uso(value) {
        this.#descricao_uso = value;
    }

    get tipo(){
        return this.#tipo
    }

    set tipo(value){
        this.#tipo = value;
    }

    get unidade(){
        return this.#unidade
    }

    set unidade(value){
        this.#unidade = value;
    }

    toString(){}

    toJSON(){
        return{
            prod_ID: this.#prod_ID,
            fabricante: this.#fabricante,
            nome: this.#nome,
            psicotropico: this.#psicotropico,
            valor_custo: this.#valor_custo,
            nomeFar: this.#nomeFar,
            observacao: this.#observacao,
            descricao_uso: this.#descricao_uso,
            tipo: this.#tipo,
            unidade: this.#unidade
        };
    }

    async gravar(){
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.gravar(this);
    }
    async atualizar(){
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.atualizar(this);
    }
    async excluir(){
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.excluir(this);
    }
    async consultar(termo){
        const produtoDAO = new ProdutoDAO();
        return await produtoDAO.consultar(termo);
        
    }
}