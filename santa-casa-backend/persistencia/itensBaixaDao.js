import Baixa from "../modelo/baixa.js";
import Unidade from "../modelo/unidade.js";

import ItensBaixa from "../modelo/itensBaixa.js";
import Lote from "../modelo/lote.js";
import Produto from "../modelo/produto.js";

export default class ItensBaixaDAO{
    async gravar(itemBaixa, conexao){
        if(itemBaixa instanceof ItensBaixa){
            const sql = `INSERT INTO ItensBaixa(ib_idBaixa, ib_idProduto, ib_idMotivo, quantidade, ib_idLote, ib_idUnidade, ib_idObservacao) 
            VALUES(?,?,?,?)`;
            const parametros = [itemBaixa.baixa.idBaixa,itemBaixa.produto.prod_ID,itemBaixa.motivo.motivo_id, itemBaixa.quantidade, itemBaixa.lote.codigo, itemBaixa.unidade.un_cod, itemBaixa.ib_idObservacao];
            await conexao.execute(sql, parametros);
        }
    }
    
    async atualizar(itemBaixa, conexao){
        if(itemBaixa instanceof ItensBaixa){
            const sql = `UPDATE ItensBaixa SET  ib_idMotivo = ? , ib_idQtde = ?, ib_idUnidade = ?, ib_idObservacao = ? WHERE ib_idBaixa = ? AND ib_idProduto = ? AND ib_idLote = ?`;
            const parametros = [itemBaixa.motivo.motivo_id, itemBaixa.quantidade, itemBaixa.unidade.un_cod, itemBaixa.baixa.idBaixa, itemBaixa.produto.prod_ID, itemBaixa.lote.codigo];
            await conexao.execute(sql, parametros);
        }
    }

    async excluir(itemBaixa, conexao){
        //Se um baixa for excluido, excluir todos os itens também?
        if(itemBaixa instanceof ItensBaixa){
            const sql = `DELETE FROM ItensBaixa WHERE ib_idBaixa = ?`;
            const parametros = [itemBaixa.baixa.idBaixa];
            await conexao.execute(sql, parametros)
        }
    }

    async consultar(itemBaixa, conexao){
        let sql = ``;
        let parametros = [];
        if(itemBaixa.baixa && itemBaixa.lote && itemBaixa.produto){
            sql = `SELECT * FROM ItensBaixa WHERE ib_idBaixa = ? AND ib_idProduto = ? AND ib_idLote = ?`;
            parametros = [itemBaixa.baixa.idBaixa, itemBaixa.produto.prod_ID, itemBaixa.lote.codigo];
        }
        else if(itemBaixa.baixa || (itemBaixa.lote && itemBaixa.produto)){
            if(itemBaixa.baixa){
                sql = `SELECT * FROM ItensBaixa WHERE ib_idBaixa = ?`;
                parametros = [itemBaixa.baixa.idBaixa];
            }
            else{
                sql = `SELECT * FROM ItensBaixa WHERE ib_idProduto = ? AND ib_idLote = ?`;
                parametros = [itemBaixa.produto.prod_ID, itemBaixa.lote.codigo];
            }
        }
        else{
            sql = `SELECT * FROM ItensBaixa`;
        }
        const [registros, campos]= await conexao.execute(sql, parametros);
        let listaItensBaixa= [];
        for(const registro of registros){
            let baixa = new baixa(registro.ib_idProduto);
            /*
            Ta entrando em loop
            await baixa.consultar(registro.ic_cons_id, conexao).then((listaCons)=>{
                baixa = listaCons.pop();
            });
            */
            let motivo = new Motivo(registro.ib_idMotivo);
            await motivo.consultar(registro.ib_idMotivo).then((listaMotivo)=>{
                motivo = listaMotivo.pop();
            });

            let unidade = new Unidade(registro.ib_idUnidade);
            await unidade.consultar(registro.ib_idUnidade).then((listaUnidade)=>{
                unidade = listaUnidade.pop();
            });

            let produto = new Produto(registro.ib_idProduto);
            await produto.consultar(registro.ib_idProduto).then((listaProd)=>{
                produto = listaProd.pop();
            });
            let lote = new Lote(registro.ib_idLote, null, null, produto);
            await lote.consultar().then((listaLote)=>{
                lote= listaLote.pop();
            });
            let novoItBaixa = new ItensBaixa(baixa, lote, produto, registro.ic_qtdeConteudoUtilizado);
            listaItensBaixa.push(novoItBaixa);
        }
        return listaItensBaixa;
    }
}