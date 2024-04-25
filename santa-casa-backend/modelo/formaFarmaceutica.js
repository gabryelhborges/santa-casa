import FormaFarmaceuticaDAO from "../persistencia/formaFaramaceuticaDAO.js";

export default class FormaFarmaceutica{
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

    async gravar(){
        const formaFaramaceuticaDAO = new FormaFarmaceuticaDAO();
        await formaFaramaceuticaDAO.gravar(this);
    }

    async atualizar(){
        const formaFaramaceuticaDAO = new FormaFarmaceuticaDAO();
        await formaFaramaceuticaDAO.atualizar(this);
    }

    async excluir(){
        const formaFaramaceuticaDAO = new FormaFarmaceuticaDAO();
        await formaFaramaceuticaDAO.excluir(this);
    }

    async consultar(termo){
        const formaFaramaceuticaDAO = new FormaFarmaceuticaDAO();
        return await formaFaramaceuticaDAO.consultar(termo);
    }
}