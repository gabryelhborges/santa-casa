import Loc from "../modelo/local.js";
import conectar from "./conexao.js";

export default class LocalDAO{
    async gravar(lugar){
        if(lugar instanceof Loc){
            const sql = `INSERT INTO loc(loc_id, loc_nome)
                         VALUES(?, ?)`;
            const parametros = [
                lugar.loc_id, 
                lugar.loc_nome
            ];
            const conexao = await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(lugar){
        if(lugar instanceof Loc){
            const sql = `UPDATE loc SET loc_nome = ? WHERE loc_id = ?`;
            const parametros = [
                lugar.loc_id,
                lugar.loc_nome
            ];
            const conexao = await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(lugar){
        if(lugar instanceof Loc){
            const sql = `DELETE FROM loc WHERE loc_id = ?`
            const parametros=[lugar.loc_id];
            const conexao=await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo){
        let sql = "";
        let parametros=[];
        if(!isNaN(parseInt(termo))){
            sql="SELECT * FROM loc WHERE loc_id = ?";
            parametros=[parseInt(termo)];
        }
        else{
            if(!termo){
                termo="";
            }
            sql = `SELECT * FROM loc WHERE loc_nome LIKE ? ORDER BY loc_nome`;
            parametros=["%"+termo+"%"];
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql,parametros);
        let listalugares = [];
        for(const registro of registros){
            let novoloc = new Loc(registro.loc_id,registro.loc_nome);
            listalugares.push(novoloc);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listalugares;
    }
}