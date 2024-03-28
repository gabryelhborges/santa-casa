class Funcionario{
    #idFuncionario;
    #nome_funcionario;
    #farmaceutico;
    #coren;
    #cpf;
    #telefone_funcionario;
    //6 atributos

    constructor(idFuncionario = 0,
                nome_funcionario = "",
                farmaceutico = "",
                coren = "",
                cpf = "",
                telefone_funcionario = ""
                ) {

        this.#idFuncionario = idFuncionario;
        this.#nome_funcionario = nome_funcionario;
        this.#farmaceutico = farmaceutico;
        this.#coren = coren;
        this.#cpf = cpf;
        this.#telefone_funcionario = telefone_funcionario;
    }
        
    // Método get para idFuncionario
    get idFuncionario() {
        return this.#idFuncionario;
    }

    // Método set para idFuncionario
    set idFuncionario(idFuncionario) {
        this.#idFuncionario = idFuncionario;
    }

    // Métodos get e set para outras propriedades
    get nome_funcionario() {
        return this.#nome_funcionario;
    }

    set nome_funcionario(nome_funcionario) {
        this.#nome_funcionario = nome_funcionario;

    }

    get farmaceutico() {
        return this.#farmaceutico;
    }

    set farmaceutico(farmaceutico) {
        this.#farmaceutico = farmaceutico;
    }

    get coren() {
        return this.#coren;
    }

    set coren(coren) {
        this.#coren = coren;
    }

    get cpf() {
        return this.#cpf;
    }

    set cpf(cpf) {
        this.#cpf = cpf;
    }

    get telefone_funcionario() {
        return this.#telefone_funcionario;
    }

    set telefone_funcionario(telefone_funcionario) {
        this.#telefone_funcionario = telefone_funcionario;
    }
    
    toString(){}

    toJSON(){
        return{
            idFuncionario: this.#idFuncionario,
            nome_funcionario: this.nome_funcionario,
            farmaceutico: this.farmaceutico,
            coren:  this.coren,
            cpf: this.cpf,
            telefone_funcionario : this.telefone_funcionario

        };
    }
}