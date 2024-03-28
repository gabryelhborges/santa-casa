class Paciente {
    #idPaciente;
    #cpf;
    #nome;
    #raca;
    #estado_civil;
    #sexo;
    #data_nascimento;
    #endereco;
    #bairro;
    #telefone;
    #profissao;
    #cadastro;
    #numero;
    #complemento;
    #cep;
    #naturalidade;
    #nome_pai;
    #nome_responsavel;
    #nome_mae;
    #nome_social;
    #utilizar_nome_social;
    #religiao;
    #orientacao_sexual;
    //23 Atributos

    constructor(idPaciente= 0, cpf= "", nome= "", raca= "", estado_civil="", sexo="", data_nascimento="", endereco="", bairro="", telefone="", profissao="", cadastro="", numero="", complemento="", cep="", naturalidade="", nome_pai="", nome_responsavel="", nome_mae="", nome_social="", utilizar_nome_social="", religiao="", orientacao_sexual= 0) {
        this.#idPaciente = idPaciente;
        this.#cpf = cpf;
        this.#nome = nome;
        this.#raca = raca;
        this.#estado_civil = estado_civil;
        this.#sexo = sexo;
        this.#data_nascimento = data_nascimento;
        this.#endereco = endereco;
        this.#bairro = bairro;
        this.#telefone = telefone;
        this.#profissao = profissao;
        this.#cadastro = cadastro;
        this.#numero = numero;
        this.#complemento = complemento;
        this.#cep = cep;
        this.#naturalidade = naturalidade;
        this.#nome_pai = nome_pai;
        this.#nome_responsavel = nome_responsavel;
        this.#nome_mae = nome_mae;
        this.#nome_social = nome_social;
        this.#utilizar_nome_social = utilizar_nome_social;
        this.#religiao = religiao;
        this.#orientacao_sexual = orientacao_sexual;
    }

    // Métodos getters
    get idPaciente() {
        return this.#idPaciente;
    }

    get cpf() {
        return this.#cpf;
    }

    get nome() {
        return this.#nome;
    }

    get data_nascimento() {
        return this.#data_nascimento;
    }

    get sexo() {
        return this.#sexo;
    }

    get nome_responsavel() {
        return this.#nome_responsavel;
    }

    get nome_mae() {
        return this.#nome_mae;
    }

    get endereco() {
        return this.#endereco;
    }

    get bairro() {
        return this.#bairro;
    }

    get telefone() {
        return this.#telefone;
    }

    get raca() {
        return this.#raca;
    }

    get estado_civil() {
        return this.#estado_civil;
    }

    get profissao() {
        return this.#profissao;
    }

    get cadastro() {
        return this.#cadastro;
    }

    get numero() {
        return this.#numero;
    }

    get complemento() {
        return this.#complemento;
    }

    get cep() {
        return this.#cep;
    }

    get nome_pai() {
        return this.#nome_pai;
    }

    get naturalidade() {
        return this.#naturalidade;
    }

    get nome_social() {
        return this.#nome_social;
    }

    get utilizar_nome_social() {
        return this.#utilizar_nome_social;
    }

    get religiao() {
        return this.#religiao;
    }

    get orientacao_sexual() {
        return this.#orientacao_sexual;
    }

    // Métodos setters
    set idPaciente(idPaciente) {
        this.#idPaciente = idPaciente;
    }

    set cpf(cpf) {
        this.#cpf = cpf;
    }

    set nome(nome) {
        this.#nome = nome;
    }

    set data_nascimento(data_nascimento) {
        this.#data_nascimento = data_nascimento;
    }

    set sexo(sexo) {
        this.#sexo = sexo;
    }

    set nome_responsavel(nome_responsavel) {
        this.#nome_responsavel = nome_responsavel;
    }

    set nome_mae(nome_mae) {
        this.#nome_mae = nome_mae;
    }

    set endereco(endereco) {
        this.#endereco = endereco;
    }

    set bairro(bairro) {
        this.#bairro = bairro;
    }

    set telefone(telefone) {
        this.#telefone = telefone;
    }

    set raca(raca) {
        this.#raca = raca;
    }

    set estado_civil(estado_civil) {
        this.#estado_civil = estado_civil;
    }

    set profissao(profissao) {
        this.#profissao = profissao;
    }

    set cadastro(cadastro) {
        this.#cadastro = cadastro;
    }

    set numero(numero) {
        this.#numero = numero;
    }

    set complemento(complemento) {
        this.#complemento = complemento;
    }

    set cep(cep) {
        this.#cep = cep;
    }

    set nome_pai(nome_pai) {
        this.#nome_pai = nome_pai;
    }

    set naturalidade(naturalidade) {
        this.#naturalidade = naturalidade;
    }

    set nome_social(nome_social) {
        this.#nome_social = nome_social;
    }

    set utilizar_nome_social(utilizar_nome_social) {
        this.#utilizar_nome_social = utilizar_nome_social;
    }

    set religiao(religiao) {
        this.#religiao = religiao;
    }

    set orientacao_sexual(orientacao_sexual) {
        this.#orientacao_sexual = orientacao_sexual;
    }

    toString(){}

    toJSON(){
        return {
            idPaciente: this.#idPaciente,
            cpf: this.#cpf,
            nome: this.#nome,
            data_nascimento: this.#data_nascimento,
            sexo: this.#sexo,
            nome_responsavel: this.#nome_responsavel,
            nome_mae: this.#nome_mae,
            endereco: this.#endereco,
            bairro: this.#bairro,
            telefone: this.#telefone,
            raca: this.#raca,
            estado_civil: this.#estado_civil,
            profissao: this.#profissao,
            cadastro: this.#cadastro,
            numero: this.#numero,
            complemento: this.#complemento,
            cep: this.#cep,
            nome_pai: this.#nome_pai,
            naturalidade: this.#naturalidade,
            nome_social: this.#nome_social,
            utilizar_nome_social: this.#utilizar_nome_social,
            religiao: this.#religiao,
            orientacao_sexual: this.#orientacao_sexual
        };
    }

    toString(){
        return "paciente: " + this.#nome;
    }
}