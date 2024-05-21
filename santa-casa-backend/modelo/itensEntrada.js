import ItensEntradaDAO from "../persistencia/itensEntradaDAO";
import Entrada from "./entrada";

export default class ItensEntrada{
    #lote;
    #entrada;
    #quantidade;

    constructor(lote = null, entrada = null, quantidade = 0){
        this.lote = lote;
        this.entrada = entrada;
        this.quantidade = quantidade;
    }

    get lote(){
        return this.lote;
    }

    set lote(valor){
        this.lote = valor;
    }

    get entrada(){
        return this.entrada;
    }

    set entrada(valor){
        this.entrada = valor;
    }

    get quantidade(){
        return this.quantidade;
    }

    set quantidade(valor){
        this.quantidade = valor;
    }

    async gravar(conexao){
        const itensEnradaDAO = new ItensEntradaDAO();
        await itensEnradaDAO.gravar(this, conexao);
    }

    async atualizar(conexao){
        const itensEnradaDAO = new ItensEntradaDAO();
        await itensEnradaDAO.atualizar(this, conexao);
    }

    async excluir(conexao){
        const itensEnradaDAO = new ItensEntradaDAO();
        await itensEnradaDAO.excluir(this, conexao);
    }

    async consultar(conexao){
        const itensEnradaDAO = new ItensEntradaDAO();
        return await itensEnradaDAO.consultar(this, conexao);
    } 
}