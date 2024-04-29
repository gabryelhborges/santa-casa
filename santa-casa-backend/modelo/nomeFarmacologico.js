import NomeFarmacologicoDAO from "../persistencia/nomeFarmacologicoDAO.js";

export default class NomeFarmacologico{
    #far_cod;
    #nome_far;

    constructor(far_cod = 0,nome_far = ""){
        this.#far_cod = far_cod;
        this.#nome_far = nome_far;
    }

    get far_cod(){
        return this.#far_cod;
    }

    set far_cod(novo){
        this.#far_cod = novo;
    }
    
    get nome_far() {
        return this.#nome_far;
    }

    set nome_far(novo){
        this.#nome_far = nome_far;
    }

    toJSON(){
        return {
            far_cod: this.#far_cod,
            nome_far: this.#nome_far
        }
    }

    async gravar(){
        const nomeFarmacologicoDAO = new NomeFarmacologicoDAO();
        await nomeFarmacologicoDAO.gravar(this);
    }

    async atualizar(){
        const nomeFarmacologicoDAO = new NomeFarmacologicoDAO();
        await nomeFarmacologicoDAO.atualizar(this);
    }

    async excluir(){
        const nomeFarmacologicoDAO = new NomeFarmacologicoDAO();
        await nomeFarmacologicoDAO.excluir(this);
    }

    async consultar(termo){
        const nomeFarmacologicoDAO = new NomeFarmacologicoDAO();
        return await nomeFarmacologicoDAO.consultar(termo);
    }
}