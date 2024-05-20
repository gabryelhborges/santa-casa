import ProdutoDAO from "../persistencia/produtoDAO.js";

export default class Produto {
    #prod_ID
    #Fabricante_idFabricante 
    #nome
    #psicotropico
    #valor_custo
    #far_cod
    #observacao
    #descricao_uso
    #tipo
    #un_min 
    

    constructor(prod_ID=0,Fabricante_idFabricante=0,nome="",psicotropico="",valor_custo=0,far_cod=0,observacao="", descricao_uso="", tipo="", un_min =0) {
        this.#prod_ID = prod_ID;
        this.#Fabricante_idFabricante = Fabricante_idFabricante;
        this.#nome = nome;
        this.#psicotropico = psicotropico;
        this.#valor_custo = valor_custo;
        this.#far_cod = far_cod;
        this.#observacao = observacao;
        this.#descricao_uso= descricao_uso; 
        this.#tipo = tipo;
        this.#un_min  = un_min;
    }

    // getter for prod_ID
    get prod_ID() {
        return this.#prod_ID;
    }

  // setter for prod_ID
    set prod_ID(value) {
    this.#prod_ID = value;
    }

    // getter for Fabricante_idFabricante
    get Fabricante_idFabricante() {
    return this.#Fabricante_idFabricante;
    }

    // setter for Fabricante_idFabricante
    set Fabricante_idFabricante(value) {
    this.#Fabricante_idFabricante = value;
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

    // getter for far_cod
    get far_cod() {
        return this.#far_cod;
    }

    // setter for far_cod
    set far_cod(value) {
        this.#far_cod = value;
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

    get un_min(){
        return this.#un_min
    }

    set un_min(value){
        this.#un_min = value;
    }

    toString(){}

    toJSON(){
        return{
            prod_ID: this.#prod_ID,
            Fabricante_idFabricante: this.#Fabricante_idFabricante,
            nome: this.#nome,
            psicotropico: this.#psicotropico,
            valor_custo: this.#valor_custo,
            far_cod: this.#far_cod,
            observacao: this.#observacao,
            descricao_uso: this.#descricao_uso,
            tipo: this.#tipo,
            un_min: this.#un_min
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