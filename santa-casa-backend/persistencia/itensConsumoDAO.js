import Consumo from "../modelo/consumo.js";
import ItensConsumo from "../modelo/itensConsumo.js";
import Lote from "../modelo/lote.js";
import Produto from "../modelo/produto.js";

export default class ItensConsumoDAO{
    async gravar(itemConsumo, conexao){
        if(itemConsumo instanceof ItensConsumo){
            const sql = `INSERT INTO ItensConsumo(ic_cons_id, ic_lote_codigo, ic_prod_id, ic_qtdeConteudoUtilizado) 
            VALUES(?,?,?,?)`;
            const parametros = [itemConsumo.consumo.idConsumo, itemConsumo.lote.codigo, itemConsumo.produto.prod_ID, itemConsumo.qtdeConteudoUtilizado];
            await conexao.execute(sql, parametros);
        }
    }

    async atualizar(itemConsumo, conexao){
        if(itemConsumo instanceof ItensConsumo){
            const sql = `UPDATE ItensConsumo SET ic_qtdeConteudoUtilizado = ? WHERE ic_cons_id = ? AND ic_lote_codigo = ? AND ic_prod_id = ?`;
            const parametros = [itemConsumo.qtdeConteudoUtilizado, itemConsumo.consumo.idConsumo, itemConsumo.lote.codigo, itemConsumo.produto.prod_ID];
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
        if(itemConsumo.consumo && itemConsumo.lote && itemConsumo.produto){
            sql = `SELECT * FROM ItensConsumo WHERE ic_cons_id = ? AND ic_lote_codigo = ? AND ic_prod_id = ?`;
            parametros = [itemConsumo.consumo.idConsumo, itemConsumo.lote.codigo, itemConsumo.produto.prod_ID];
        }
        else if(itemConsumo.consumo || (itemConsumo.lote && itemConsumo.produto)){
            if(itemConsumo.consumo){
                sql = `SELECT * FROM ItensConsumo WHERE ic_cons_id = ?`;
                parametros = [itemConsumo.consumo.idConsumo];
            }
            else{
                sql = `SELECT * FROM ItensConsumo WHERE ic_lote_codigo = ? AND ic_prod_id = ?`;
                parametros = [itemConsumo.lote.codigo, itemConsumo.produto.prod_ID];
            }
        }
        else{
            sql = `SELECT * FROM ItensConsumo`;
        }
        const [registros, campos]= await conexao.execute(sql, parametros);
        let listaItensConsumo= [];
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
            let novoItCons = new ItensConsumo(consumo, lote, produto, registro.ic_qtdeConteudoUtilizado);
            listaItensConsumo.push(novoItCons);
        }
        return listaItensConsumo;
    }

    async relatorioProdutosConsumidos(itCons, conexao) {
        let sql;
        let parametros = [];

        sql = `SELECT p.nome, l.total_conteudo, ic.ic_lote_codigo, u.unidade, sum(ic.ic_qtdeConteudoUtilizado) total FROM 
        ItensConsumo ic INNER JOIN Produtos p ON ic.ic_prod_id = p.prod_ID
        INNER JOIN Lote l ON l.produto_prod_ID = p.prod_ID
        INNER JOIN Unidade u ON u.un_cod = p.un_min
        GROUP BY ic.ic_lote_codigo
        `;

        //Pesquisar por produto
        if (itCons.produto) {
            sql+= ` HAVING p.nome LIKE ?`;
            parametros= ['%'+itCons.produto.nome+'%'];
        }

        const [registros, campos] = await conexao.execute(sql, parametros);
        let listaRelatorio = [];
        for(const registro of registros){
            let objRelatorio= {
                produto: {
                    nome: "",
                    unidade:{
                        un_min: ""
                    }
                },
                lote: {
                    codigo: "",
                    total_conteudo: 0 
                },
                total: 0
            };
            objRelatorio.produto.nome= registro.nome;
            objRelatorio.lote.codigo= registro.ic_lote_codigo;
            objRelatorio.lote.total_conteudo= registro.total_conteudo;
            objRelatorio.total= registro.total;
            objRelatorio.produto.unidade.un_min= registro.unidade;
            listaRelatorio.push(objRelatorio);
        }
        return listaRelatorio;
    }
}