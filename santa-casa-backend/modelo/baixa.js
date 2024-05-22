import BaixaDao from "../persistencia/baixaDAO.js";

export default class Baixa{
    #idBaixa;
    #itensBaixa; //lista produtos
    #funcionario; //objeto funcionario
    #dataBaixa;
    #local; //ob local
    
    constructor(idBaixa= 0, itensBaixa= [], funcionario=null, dataBaixa= "", local = null){
        this.#idBaixa = idBaixa;
        this.#itensBaixa = itensBaixa;
        this.#funcionario = funcionario;
        this.#dataBaixa = dataBaixa;
        this.#local = local;
    }

    get idBaixa(){
        return this.#idBaixa;
    }
    set idBaixa(novoidBaixa){
        this.#idBaixa= novoidBaixa;
    }

    get itensBaixa(){
        return this.#itensBaixa;
    }
    set itensBaixa(novoItens){
        this.#itensBaixa = novoItens;
    }

    get funcionario(){
        return this.#funcionario;
    }
    set funcionario(novoFuncionario){
        this.#funcionario = novoFuncionario;
    }

    get dataBaixa(){
        return this.#dataBaixa;
    }
    set dataBaixa(novadataBaixa){
        this.#dataBaixa = novadataBaixa;
    }

    get local(){
        return this.#local;
    }
    set local(novoLocal){
        this.#local = novoLocal;
    }


    toJSON(){
        return {
            idBaixa: this.#idBaixa,
            itensBaixa: this.#itensBaixa,
            funcionario: this.#funcionario,
            dataBaixa: this.#dataBaixa,
            local: this.#local
        };
    }

    async gravar(conexao){
        const baixaDao = new BaixaDao();
        await baixaDao.gravar(this, conexao);
    }

    async atualizar(conexao){
        const baixaDao = new BaixaDao();
        await baixaDao.atualizar(this, conexao);
    }

    async excluir(conexao){
        const baixaDao = new BaixaDao();
        await baixaDao.excluir(this, conexao);
    }

    async consultar(termo, conexao){
        const baixaDao = new BaixaDao();
        return await baixaDao.consultar(termo, conexao);
    }
}