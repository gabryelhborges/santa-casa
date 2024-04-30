class FormaFarmaceutica{
    #ffa_cod;
    #forma;

    constructor(ffa_cod = 0,forma = ""){
        this.#ffa_cod = ffa_cod;
        this.#forma = forma;
    }

    get ffa_cod(){
        return this.#ffa_cod;
    }

    set ffa_cod(novo){
        this.#ffa_cod = novo;
    }
    
    get forma() {
        return this.#forma;
    }

    set forma(novo){
        this.#forma = forma;
    }

    toJSON(){
        return {
            ffa_cod: this.#ffa_cod,
            forma: this.#forma
        }
    }

}