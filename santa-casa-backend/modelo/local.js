import LocalDAO from '../persistencia/localDAO.js';

export default class Loc{
    #loc_id;
    #loc_nome;
    constructor(loc_id=0, loc_nome=""){
        this.#loc_id=loc_id;
        this.#loc_nome = loc_nome;
    }
    get loc_id(){
        return this.#loc_id;
    }
    set loc_id(novo){
        this.#loc_id = novo;
    }
    get loc_nome(){
        return this.#loc_nome;
    }
    set loc_nome(novo) {
        this.#loc_nome = novo;
    }
    toJSON(){
        return{
            loc_id: this.#loc_id,
            loc_nome: this.#loc_nome
        };
    }
    async gravar(){
        const locDAO = new LocalDAO();
        await locDAO.gravar(this);
    }
    async atualizar(){
        const locDAO = new LocalDAO();
        await locDAO.atualizar(this);
    }
    async excluir(){
        const locDAO = new LocalDAO();
        await locDAO.excluir(this);
    }
    async consultar(){
        const locDAO = new LocalDAO();
        return await locDAO.consultar(this);
    }
}
