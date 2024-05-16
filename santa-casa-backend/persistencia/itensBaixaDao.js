import Baixa from "../modelo/baixa.js";
import ItensBaixa from "../modelo/itensBaixa.js";
import Lote from "../modelo/lote.js";
import Produto from "../modelo/produto.js";

export default class ItensBaixaDAO{
    async gravar(itemBaixa, conexao){
        if(itemBaixa instanceof ItensBaixa){
            const sql = `INSERT INTO ItensBaixa(ib_idBaixa, ib_idProduto, ib_idMotivo, ib_idQtde, ib_idLote, ib_idUnidade, ib_idObservacao) 
            VALUES(?,?,?,?)`;
            const parametros = [itemBaixa.consumo.idConsumo, itemBaixa.lote.codigo, itemBaixa.produto.prod_ID, itemBaixa.qtdeConteudoUtilizado];
            await conexao.execute(sql, parametros);
        }
    }

    async atualizar(itemBaixa, conexao){
        if(itemBaixa instanceof ItensBaixa){
            const sql = `UPDATE ItensBaixa SET ic_qtdeConteudoUtilizado = ? WHERE ic_cons_id = ? AND ic_lote_codigo = ? AND ic_prod_id = ?`;
            const parametros = [itemBaixa.qtdeConteudoUtilizado, itemBaixa.consumo.idConsumo, itemBaixa.lote.codigo, itemBaixa.produto.prod_ID];
            await conexao.execute(sql, parametros);
        }
    }

    async excluir(itemBaixa, conexao){
        //Se um consumo for excluido, excluir todos os itens também?
        if(itemBaixa instanceof ItensBaixa){
            const sql = `DELETE FROM ItensBaixa WHERE ic_cons_id = ?`;
            const parametros = [itemBaixa.consumo.idConsumo];
            await conexao.execute(sql, parametros)
        }
    }

    async consultar(itemBaixa, conexao){
        let sql = ``;
        let parametros = [];
        if(itemBaixa.consumo && itemBaixa.lote && itemBaixa.produto){
            sql = `SELECT * FROM ItensBaixa WHERE ic_cons_id = ? AND ic_lote_codigo = ? AND ic_prod_id = ?`;
            parametros = [itemBaixa.consumo.idConsumo, itemBaixa.lote.codigo, itemBaixa.produto.prod_ID];
        }
        else if(itemBaixa.consumo || (itemBaixa.lote && itemBaixa.produto)){
            if(itemBaixa.consumo){
                sql = `SELECT * FROM ItensBaixa WHERE ic_cons_id = ?`;
                parametros = [itemBaixa.consumo.idConsumo];
            }
            else{
                sql = `SELECT * FROM ItensBaixa WHERE ic_lote_codigo = ? AND ic_prod_id = ?`;
                parametros = [itemBaixa.lote.codigo, itemBaixa.produto.prod_ID];
            }
        }
        else{
            sql = `SELECT * FROM ItensBaixa`;
        }
        const [registros, campos]= await conexao.execute(sql, parametros);
        let listaItensBaixa= [];
        for(const registro of registros){
            let consumo = new Consumo(registro.ic_cons_id);
            /*
            Ta entrando em loop
            await consumo.consultar(registro.ic_cons_id, conexao).then((listaCons)=>{
                consumo = listaCons.pop();
            });
            */
            let produto = new Produto(registro.ic_prod_id);
            await produto.consultar(registro.ic_prod_id).then((listaProd)=>{
                produto = listaProd.pop();
            });
            let lote = new Lote(registro.ic_lote_codigo, null, null, produto);
            await lote.consultar().then((listaLote)=>{
                lote= listaLote.pop();
            });
            let novoItCons = new ItensBaixa(consumo, lote, produto, registro.ic_qtdeConteudoUtilizado);
            listaItensBaixa.push(novoItCons);
        }
        return listaItensBaixa;
    }
}