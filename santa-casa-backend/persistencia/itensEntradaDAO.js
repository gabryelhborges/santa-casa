import Entrada from "../modelo/entrada.js";
import Produto from "../modelo/produto.js";
import Lote from "../modelo/lote.js";
import ItensEntrada from "../modelo/itensEntrada.js";

export default class ItensEntradaDAO{
    async gravar(itens,conexao){
        const sql = `INSERT INTO itensEntrada(ent_id,
            lote_cod,
            prod_id,
            qtde) VALUES (?,?,?,?);`
        const parametros = [itens.entrada.entrada_id,
            itens.lote.cod_lote,
            itens.lote.produto.produto_id,
            itens.quantidade
        ];
        await conexao.execute(sql,parametros);
    }

    async excluir(itens,conexao){
        const sql = `DELETE FROM itensEntrada WHERE ent_id = ? `
        const parametros = [itens.entrada.entrada_id];
        await conexao.execute(sql,parametros);
    }

    async consultar(itens,conexao){
        let sql = ``;
        let parametros = [];
        if(itens.entrada && itens.lote && itens.produto){
            sql = `SELECT * FROM itensEntrada WHERE ent_id = ? AND lote_cod = ? AND prod_id = ?`;
            parametros = [itens.entrada.entrada_id, itens.lote.codigo, itens.produto.prod_ID];
        }else if(itens.entrada || (itens.lote && itens.produto)){
            if(itens.entrada){
                sql = 'SELECT * FROM itensEntrada WHERE ent_id = ?';
                parametros = [itens.entrada.entrada_id];
            }else{
                sql = 'SELECT * FROM itensEntrada WHERE lote_cod = ? AND prod_id = ?';
                parametros = [itens.lote.codigo, itens.produto.prod_ID];
            }
        }else{
            sql = 'SELECT * FROM itensEntrada';
        }
        const [registros, campos]= await conexao.execute(sql, parametros);
        let listaItensEntradas= [];
        for(const registro of registros){
            let entrada = new Entrada(registro.ent_id);

            let produto = new Produto(registro.prod_id);
            await produto.consultar(registro.prod_id).then((listaProd)=>{
                produto = listaProd.pop();
            });
            let lote = new Lote(registro.lote_cod, null, null, produto);
            await lote.consultar().then((listaLote)=>{
                lote= listaLote.pop();
            });
            let itensEnrada = new ItensEntrada(entrada, lote, produto, registro.quantidade);
            listaItensEntradas.push(itensEnrada);
        }
        return listaItensEntradas;
    }
}