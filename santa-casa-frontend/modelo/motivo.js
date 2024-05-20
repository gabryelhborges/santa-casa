class Motivo{
    #motivo_id;
    #motivo;

    constructor(motivo_id = 0,motivo = ""){
        this.#motivo_id = motivo_id;
        this.#motivo = motivo;
    }

    get motivo_id(){
        return this.#motivo_id;
    }

    set motivo_id(novo){
        this.#motivo_id = novo;
    }
    
    get motivo() {
        return this.#motivo;
    }

    set motivo(novo){
        this.#motivo = motivo;
    }

    toJSON(){
        return {
            motivo_id: this.#motivo_id,
            motivo: this.#motivo
        }
    }

}
