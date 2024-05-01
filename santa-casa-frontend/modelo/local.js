class Local{
    #loc_id;
    #loc_nome
    constructor(id="", nome=""){
        this.#loc_id = id;
        this.#loc_nome = nome; 
    }

    get loc_id(){
        return this.#loc_id;

    }
    set loc_id(novo){
        this.#loc_id= novo;
    }

    get loc_nome(){
        return this.#loc_nome;
    }
    set loc_nome(novo){
        this.#loc_nome = novo;
    }

    toJSON(){
        return{
            loc_id: this.#loc_id,
            loc_nome: this.#loc_nome
        };
    }
}