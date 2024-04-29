class Produto{
    #prod_ID
    #Fabricante_idFabricante 
    #nome
    #psicotropico
    #valor_custo
    #far_cod
    #ffa_cod
    #uni_cod
    #observacao
    #descricao_uso
    #tipo
    

    constructor(prod_ID=0,Fabricante_idFabricante=0,nome="",psicotropico="",valor_custo=0,far_cod=0,ffa_cod=0,uni_cod=0,observacao="", descricao_uso="", tipo="") {
        this.#prod_ID = prod_ID;
        this.#Fabricante_idFabricante = Fabricante_idFabricante;
        this.#nome = nome;
        this.#psicotropico = psicotropico;
        this.#valor_custo = valor_custo;
        this.#far_cod = far_cod;
        this.#ffa_cod = ffa_cod;
        this.#uni_cod = uni_cod;
        this.#observacao = observacao;
        this.#descricao_uso= descricao_uso; 
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

    // getter for far_cod
    get far_cod() {
        return this.#far_cod;
    }

    // setter for far_cod
    set far_cod(value) {
        this.#far_cod = value;
    }

    // getter for ffa_cod
    get ffa_cod() {
        return this.#ffa_cod;
    }

    // setter for ffa_cod
    set ffa_cod(value) {
        this.#ffa_cod = value;
    }

    get uni_cod(){
        return this.#uni_cod;
    }

    set uni_cod(value){
        this.#uni_cod = value;
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
            far_cod: this.#far_cod,
            ffa_cod: this.#ffa_cod,
            uni_cod: this.#uni_cod,
            observacao: this.#observacao,
            descricao_uso: this.#descricao_uso,
            tipo: this.#tipo
        };
    }

    toString(){
        return "produto: " + this.#nome;
    }

}