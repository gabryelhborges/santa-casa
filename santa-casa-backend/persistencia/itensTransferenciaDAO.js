import Transferencia from "../modelo/transferencia.js";
import ItensTransferencia from "../modelo/itensTransferencia.js";
import Lote from "../modelo/lote.js";
import Produto from "../modelo/produto.js";

export default class ItensTransferenciaDAO{
    async gravar(itemTransferencia, conexao){
        if(itemTransferencia instanceof ItensTransferencia){
            const sql = `INSERT INTO itensTransferidos(itf_tf_id,itf_prod_id,itf_lote_cod,itf_qtdetransferida)
            values(?,?,?,?)`;
            const parametros = [itemTransferencia.transf_id, itemTransferencia.prod_cod, itemTransferencia.lote_cod, itemTransferencia.quantidade];
            await conexao.execute(sql,parametros);
        }
    }

    async atualizar(itemTransferencia, conexao){ //nem vou usar
        if(itemTransferencia instanceof ItensTransferencia){
            const sql = `UPDATE itensTransferidos SET itf_qtdetransferida = ? WHERE itf_tf_id = ? AND itf_prod_id = ? AND itf_lote_cod = ?`;
            const parametros = [itemTransferencia.quantidade, itemTransferencia.transf_id.tf_id, itemTransferencia.prod_cod.prod_ID, itemTransferencia.lote_cod.lote_cod];
            await conexao.execute(sql,parametros);
        }
    }

    async excluir(itemTransferencia, conexao){
        if(itemTransferencia instanceof ItensTransferencia){
            const sql = `DELETE FROM itensTransferidos WHERE itf_tf_id = ? AND itf_prod_id = ? AND itf_lote_cod = ?`;
            const parametros = [itemTransferencia.transf_id.tf_id, itemTransferencia.prod_cod.prod_ID, itemTransferencia.lote_cod.lote];
            await conexao.execute(sql,parametros);
        }
    }

    async consultar(itemTransferencia, conexao){
        let sql = ``;
        let parametros = [];
        if(itemTransferencia.transf_id && itemTransferencia.prod_cod && itemTransferencia.lote_cod){
            sql = `SELECT * FROM itensTransferidos WHERE itf_tf_id = ? AND itf_prod_id = ? AND itf_lote_cod = ?`;
            parametros = [itemTransferencia.transf_id.tf_id, itemTransferencia.prod_cod.prod_ID, itemTransferencia.lote_cod.lote_cod];
        }
        else if(itemTransferencia.transf_id || (itemTransferencia.prod_cod && itemTransferencia.lote_cod)){
            if(itemTransferencia.transf_id){
                sql = `SELECT * FROM itensTransferidos WHERE itf_tf_id = ?`;
                parametros = [itemTransferencia.transf_id.tf_id];
            }
            else{
                sql = `SELECT * FROM itensTransferidos WHERE itf_prod_id = ? AND itf_lote_cod = ?`;
                parametros = [itemTransferencia.prod_cod.prod_ID, itemTransferencia.lote_cod.lote_cod];
            }
        }
        else{
            sql = `SELECT * FROM itensTransferidos`;
        }
        const [registros,campos] = await conexao.execute(sql,parametros);
        let listaItensTransferencia = [];
        for(const registro of registros){
            let transferencia = new Transferencia(registro.tf_id);
            let produto = new Produto(registro.itf_prod_id);
            await produto.consultar(registro.itf_prod_id).then((listaProd)=>{
                produto = listaProd.pop();
            });
            let lote = new Lote(registro.itf_lote_cod, null, null, produto);
            await lote.consultar().then((listaLote)=>{
                lote = listaLote.pop();
            });
            let novoItTransf = new ItensTransferencia(transferencia,produto,lote,registro.itf_qtdetransferida);
            listaItensTransferencia.push(novoItTransf);
        }
        return listaItensTransferencia;
    }
}