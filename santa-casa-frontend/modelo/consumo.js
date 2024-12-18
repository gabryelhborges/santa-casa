class Consumo{
    #idConsumo;
    #paciente;//objeto paciente
    #funcionario;//objeto funcionario
    #itensConsumo;//lista de produtos utilizados
    #dataConsumo;
    
    constructor(idConsumo= 0, paciente= null, funcionario= null, itensConsumo= [], dataConsumo= ""){
        this.#idConsumo = idConsumo;
        this.#paciente = paciente;
        this.#funcionario = funcionario;
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

    toJSON(){
        return {
            idConsumo: this.#idConsumo,
            paciente: this.#paciente,
            funcionario: this.#funcionario,
            itensConsumo: this.#itensConsumo,
            dataConsumo: this.#dataConsumo
        };
    }
}