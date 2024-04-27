import Consumo from "../modelo/consumo.js";
import ItensConsumo from "../modelo/itensConsumo.js";
import Lote from "../modelo/lote.js";

export default class ItensConsumoDAO{
    async gravar(itemConsumo, conexao){
        if(itemConsumo instanceof ItensConsumo){
            const sql = `INSERT INTO ItensConsumo(ic_cons_id, ic_lote_codigo, ic_qtdeConteudoUtilizado) 
            VALUES(?,?,?)`;
            const parametros = [itemConsumo.consumo.idConsumo, itemConsumo.lote.codigo, itemConsumo.qtdeConteudoUtilizado];
            await conexao.execute(sql, parametros);
        }
    }

    async atualizar(itemConsumo, conexao){
        if(itemConsumo instanceof ItensConsumo){
            const sql = `UPDATE ItensConsumo SET ic_qtdeConteudoUtilizado = ? WHERE ic_cons_id = ? AND ic_lote_codigo = ?`;
            const parametros = [itemConsumo.qtdeConteudoUtilizado, itemConsumo.consumo.idConsumo, itemConsumo.lote.codigo];
            await conexao.execute(sql, parametros);
        }
    }

    async excluir(itemConsumo, conexao){
        //Se um consumo for excluido, excluir todos os itens também?
        if(itemConsumo instanceof ItensConsumo){
            const sql = `DELETE FROM ItensConsumo WHERE ic_cons_id = ?`;
            const parametros = [itemConsumo.consumo.idConsumo];
            await conexao.execute(sql, parametros)
        }
    }

    async consultar(itemConsumo, conexao){
        let sql = ``;
        let parametros = [];
        if(itemConsumo.consumo.idConsumo && itemConsumo.lote.codigo){
            sql = "SELECT * FROM ItensConsumo WHERE ic_cons_id = ? AND ic_lote_codigo = ?";
            parametros = [itemConsumo.consumo.idConsumo, itemConsumo.lote.codigo];
        }
        else{
            sql = "SELECT * FROM ItensConsumo;"
        }
        const [registros, campos]= await conexao.execute(sql, parametros);
        let listaItensConsumo= [];
        for(const registro of registros){
            let consumo = new Consumo();
            await consumo.consultar(registro.ic_cons_id, conexao).then((listaCons)=>{
                consumo = listaCons.pop();
            });
            let lote = new Lote();
            await lote.consultar(registro.ic_lote_codigo).then((listaLote)=>{
                lote= listaLote.pop();
            });
            let novoItCons = new ItensConsumo(consumo, lote, registro.ic_qtdeConteudoUtilizado);
            listaItensConsumo.push(novoItCons);
        }
        return listaItensConsumo;
    }
}