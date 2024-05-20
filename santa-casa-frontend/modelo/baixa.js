class Baixa{
    #idBaixa;
    #itensBaixa; //lista produtos
    #funcionario; //objeto funcionario
    #dataBaixa;
    #local; //ob local
    
    constructor(idBaixa= 0, itensBaixa= null, funcionario=null, dataBaixa= "", local = null){
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

}