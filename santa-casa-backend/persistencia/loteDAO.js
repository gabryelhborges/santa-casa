import Lote from "../modelo/lote.js";
import conectar from "./conexao.js";
import FormaFarmaceutica from "../modelo/formaFarmaceutica.js";
import Unidade from "../modelo/unidade.js";
import Produto from "../modelo/produto.js";
import Local from "../modelo/local.js";


export default class LoteDAO{
    //da para cadastrar lote e codigo iguais tenho que consertar
    async gravar(lote){
        if(lote instanceof Lote){
            const sql = `INSERT INTO lote(codigo,
                        data_validade,
                        quantidade,
                        produto_prod_ID,
                        formafarmaceutica_ffa_cod,
                        conteudo_frasco,
                        unidade_un_cod,
                        total_conteudo,
                        loc
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const parametros = [
                lote.codigo,
                lote.data_validade,
                lote.quantidade,
                lote.produto.prod_ID,
                lote.formaFarmaceutica.ffa_cod,
                lote.conteudo_frasco,  
                lote.unidade.un_cod,  
                lote.total_conteudo,
                lote.local.loc_id
            ];
            const conexao = await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async verificarExistenciaLote(lote) {
        const sql = `SELECT * FROM lote WHERE codigo = ? AND produto_prod_ID = ?`;
        const parametros = [lote.codigo, lote.produto.prod_ID];
        const conexao = await conectar();
        const lot = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);
        if(lot == null) 
            return true;
        return false;
    }

    async atualizar(lote, conexao){
        if(lote instanceof Lote) { 
            const sql= `UPDATE lote SET 
                quantidade = ?,
                formafarmaceutica_ffa_cod = ?,
                conteudo_frasco = ?,
                unidade_un_cod = ?,
                total_conteudo = ?,
                loc = ?
                WHERE codigo = ? AND produto_prod_ID = ?`;
            const parametros = [
                lote.quantidade,
                lote.formaFarmaceutica.ffa_cod,
                lote.conteudo_frasco,  
                lote.unidade.un_cod,  
                lote.total_conteudo,
                lote.local.loc_id,
                lote.codigo,
                lote.produto.prod_ID
            ];
            await conexao.execute(sql, parametros);
        }
    }

    async excluir(lote){
        if(lote instanceof Lote){
            const sql = "DELETE FROM lote WHERE codigo = ? AND produto_prod_ID = ?";
            const parametros =[lote.codigo, lote.produto.prod_ID];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(lote){
        let sql = "";
        let parametros = [];
        if(lote.produto != null){
            sql = `SELECT * FROM 
            lote WHERE  produto_prod_ID = ?`
            if(lote.codigo!=0){
                sql  += ` AND codigo = ?;`
                parametros = [lote.produto.prod_ID,lote.codigo];
            }
            else{
                sql += " ORDER BY data_validade ASC;"
                parametros = [lote.produto.prod_ID];
            }
            
        }else{
            sql = "SELECT * FROM lote"
            parametros = [lote.codigo];
        }
        const conexao = await conectar();
        const [registros, campos]= await conexao.execute(sql, parametros);//A execução do select retornará uma lista dos registros que atendem a condição em "registros"
        let listaLotes = [];
        //Preenchendo a lista com cada registro retornado
        for(const registro of registros){
            let produto = new Produto(registro.produto_prod_ID);
            await produto.consultar(registro.produto_prod_ID).then((listaProdutos)=>{
                produto = listaProdutos.pop();
            });
            let formaFarmaceutica = new FormaFarmaceutica(registro.formafarmaceutica_ffa_cod);
            await formaFarmaceutica.consultar(registro.formafarmaceutica_ffa_cod).then((listaFormaFaramaceuticas)=>{
                formaFarmaceutica = listaFormaFaramaceuticas.pop();
            });
            let unidade = new Unidade(registro.unidade_un_cod);
            await unidade.consultar(registro.unidade_un_cod).then((listaUnidades)=>{
                unidade = listaUnidades.pop();
            });
            let local = new Local(registro.local_loc_id);
            await local.consultar(registro.local_loc_id).then((listaLocais)=>{
                local = listaLocais.pop();
            });
            
            let lote = new Lote(registro.codigo,registro.data_validade,
                registro.quantidade,produto,formaFarmaceutica,registro.conteudo_frasco,
                unidade,registro.total_conteudo,local
            );
            listaLotes.push(lote);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaLotes;
    }


}

/*
{
    "codigo": 1,
    "data_validade": "2000-02-20",
    "quantidade": 12,
    "produto": {"prod_ID": 1},
    "formaFarmaceutica": {
            "ffa_cod": 1,
            "forma": "comprimido"
        },
    "conteudo_frasco": 13,
    "unidade": {
            "un_cod": 1,
            "unidade": "Quilograma(kg)"
        },
    "total_conteudo": 106
}
*/

//da para cadastrar lote e codigo iguais tenho que consertar