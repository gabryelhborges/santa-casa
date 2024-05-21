import Transferencia from "../modelo/transferencia.js";
import Lote from "../modelo/lote.js";
import Loc from "../modelo/local.js";

export default class TransferenciaDAO{
    async gravar(itens, conexao){
        if(itens instanceof Transferencia){
            const sql = "INSERT INTO itensTransferidos(itf_lote_cod,itf_qtdetransferida,itf_unidade,itf_origem,itf_destino) values(?,?,?,?,?)";
            const parametros = [itens.lote.codigo,itens.quantidade,itens.itens.lote.unidade.unidade,itens.lote.local.loc_id,itens.destino];
            const retorno = await conexao.execute(sql, parametros);
        }
    }
}
