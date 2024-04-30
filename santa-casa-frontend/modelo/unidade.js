class Unidade{
    #un_cod;
    #unidade;

    constructor(un_cod = 0, unidade = ""){
        this.#un_cod = un_cod;
        this.#unidade = unidade;  
    } 
    
    get un_cod(){
        return this.#un_cod;
    }

    set un_cod(novo){
        this.#un_cod = novo;
    }

    get  unidade(){
        return this.#unidade;
    }

    set unidade(novo){
        this.#unidade= novo;
    }

    toJSON(){
        return{
            un_cod: this.#un_cod,
            unidade: this.#unidade
        };
    }
}