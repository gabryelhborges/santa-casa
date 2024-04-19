class Produto{
    #prod_ID
    #Fabricante_idFabricante 
    #nome
    #psicotropico
    #valor_custo
    #ultima_compra
    #ultima_saida
    #observacao
    #descricao_uso
    #quantidade_total
    #tipo
    

    constructor(prod_ID=0,Fabricante_idFabricante=0,nome="",psicotropico="",valor_custo=0,ultima_compra="",ultima_saida="",observacao="", descricao_uso="", quantidade_total=0,tipo="") {
        this.#prod_ID = prod_ID;
        this.#Fabricante_idFabricante = Fabricante_idFabricante;
        this.#nome = nome;
        this.#psicotropico = psicotropico;
        this.#valor_custo = valor_custo;
        this.#ultima_compra = ultima_compra;
        this.#ultima_saida = ultima_saida;
        this.#observacao = observacao;
        this.#descricao_uso= descricao_uso; 
        this.#quantidade_total = quantidade_total;
        this.#tipo = tipo;
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

    // getter for ultima_compra
    get ultima_compra() {
        return this.#ultima_compra;
    }

    // setter for ultima_compra
    set ultima_compra(value) {
        this.#ultima_compra = value;
    }

    // getter for ultima_saida
    get ultima_saida() {
        return this.#ultima_saida;
    }

    // setter for ultima_saida
    set ultima_saida(value) {
        this.#ultima_saida = value;
    }

    // getter for quantidade_total
    get quantidade_total() {
        return this.#quantidade_total;
    }

    // setter for quantidade_total
    set quantidade_total(value) {
        this.#quantidade_total = value;
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

    toString(){}

    toJSON(){
        return{
            prod_ID: this.#prod_ID,
            Fabricante_idFabricante: this.#Fabricante_idFabricante,
            nome: this.#nome,
            psicotropico: this.#psicotropico,
            valor_custo: this.#valor_custo,
            ultima_compra: this.#ultima_compra,
            ultima_saida: this.#ultima_saida,
            observacao: this.#observacao,
            descricao_uso: this.#descricao_uso,
            quantidade_total: this.#quantidade_total,
            tipo: this.#tipo
        };
    }

    toString(){
        return "produto: " + this.#nome;
    }

}