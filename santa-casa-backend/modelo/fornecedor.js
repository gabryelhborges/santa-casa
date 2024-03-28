import FornecedorDAO from "../persistencia/fornecedorDAO.js";

export default class Fornecedor{
    #idFornecedor;
    #cnpj;
    #f_nome;
    #endereco;
    #numero;
    #complemento;
    #bairro;
    #cidade;
    #uf;
    #telefone;

    constructor(idFornecedor=0,cnpj="",f_nome="",endereco="",numero=0,complemento="",bairro="",cidade="",uf="", telefone="") {
        this.#idFornecedor = idFornecedor;
        this.#cnpj = cnpj;
        this.#f_nome = f_nome;
        this.#endereco = endereco;
        this.#numero = numero;
        this.#complemento = complemento;
        this.#bairro = bairro;
        this.#cidade = cidade;
        this.#uf = uf;
        this.#telefone= telefone; 
    }

    // getter for idFornecedor
    get idFornecedor() {
        return this.#idFornecedor;
    }

  // setter for idFornecedor
    set idFornecedor(value) {
    this.#idFornecedor = value;
    }

    // getter for cnpj
    get cnpj() {
    return this.#cnpj;
    }

    // setter for cnpj
    set cnpj(value) {
    this.#cnpj = value;
    }

    // getter for f_nome
    get f_nome() {
    return this.#f_nome;
    }

    // setter for f_nome
    set f_nome(value) {
        this.#f_nome = value;
    }

    // getter for endereco
    get endereco() {
        return this.#endereco;
    }

    // setter for endereco
    set endereco(value) {
        this.#endereco = value;
    }

    // getter for numero
    get numero() {
        return this.#numero;
    }

    // setter for numero
    set numero(value) {
        this.#numero = value;
    }

    // getter for complemento
    get complemento() {
        return this.#complemento;
    }

    // setter for complemento
    set complemento(value) {
        this.#complemento = value;
    }

    // getter for bairro
    get bairro() {
        return this.#bairro;
    }

    // setter for bairro
    set bairro(value) {
        this.#bairro = value;
    }

    // getter for cidade
    get cidade() {
        return this.#cidade;
    }

    // setter for cidade
    set cidade(value) {
        this.#cidade = value;
    }

    // getter for uf
    get uf() {
        return this.#uf;
    }

    // setter for uf
    set uf(value) {
        this.#uf = value;
    }

    // getter for telefone
    get telefone() {
        return this.#telefone;
    }

    // setter for telefone
    set telefone(value) {
        this.#telefone = value;
    }

    toString(){}

    toJSON(){
        return{
            idFornecedor: this.#idFornecedor,
            cnpj: this.#cnpj,
            f_nome: this.#f_nome,
            endereco: this.#endereco,
            numero: this.#numero,
            complemento: this.#complemento,
            bairro: this.#bairro,
            cidade: this.#cidade,
            uf: this.#uf,
            telefone: this.#telefone
        };
    }

    async gravar(){
        const fornDAO = new FornecedorDAO();
        await fornDAO.gravar(this);
    }
    async atualizar(){
        const fornDAO = new FornecedorDAO();
        await fornDAO.atualizar(this);
    }
    async excluir(){
        const fornDAO = new FornecedorDAO();
        await fornDAO.excluir(this);
    }
    async consultar(termo){
        const fornDAO = new FornecedorDAO();
        return await fornDAO.consultar(termo);
    }
}