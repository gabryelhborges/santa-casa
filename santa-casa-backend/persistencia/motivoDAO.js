import conectar from "./conexao.js";
import Motivo from "../modelo/motivo.js"

export default class MotivoDAO{
    async gravar(motivo){
        if(motivo instanceof Motivo){
            const sql = "INSERT INTO motivo(motivo) VALUES(?)";
            const parametros = [
                motivo.motivo
            ]
            const conexao = await conectar();
            const retorno = await conexao.execute(sql,parametros);
            motivo.motivo_id = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(motivo){
        if(motivo instanceof Motivo){
            const sql = `UPDATE  motivo SET motivo = ? WHERE motivo_id=?`;
            const parametros = [
                motivo.motivo,
                motivo.motivo_id
            ]
            const conexao = await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(motivo){
        if(motivo instanceof Motivo){
            const sql = 'DELETE FROM motivo WHERE motivo_id = ?';
            const parametros = [
              motivo.motivo_id
            ];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);            
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo){
        let sql = "";
        let parametros = [];
        if(!isNaN(parseInt(termo))){
            sql = `SELECT * FROM motivo WHERE motivo_id = ?`;
            parametros = [termo]; 
        }
        else{
            if(!termo){
                termo = "";
            }
            sql = `SELECT * FROM motivo
            WHERE motivo like ? ORDER BY motivo_id`;
            parametros = ["%" + termo + "%"];
        }
        const conexao = await conectar();
        const [registros, campos] =  await conexao.execute(sql, parametros);        
        let listaMotivos = [];
        for(const registro of registros){
            let motivo = new Motivo(registro.motivo_id,registro.motivo);
            listaMotivos.push(motivo);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaMotivos;
    }

}