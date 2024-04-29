import NomeFarmacologico from "../modelo/nomeFarmacologico.js";
import conectar from "./conexao.js";

export default class NomeFarmacologicoDAO{
    async gravar(nomeFarmacologico){
        if(nomeFarmacologico instanceof NomeFarmacologico){
            const sql = "INSERT INTO nomefarmacologico (nome_far) VALUES(?)";
            const parametros = [
                nomeFarmacologico.nome_far
            ]
            const conexao = await conectar();
            const retorno = await conexao.execute(sql,parametros);
            nomeFarmacologico.far_cod = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(nomeFarmacologico){
        if(nomeFarmacologico instanceof NomeFarmacologico){
            const sql = `UPDATE  NomeFarmacologico SET 
            nome_far=? WHERE far_cod=?`;
            const parametros = [
                nomeFarmacologico.nome_far,
                nomeFarmacologico.far_cod
            ]
            const conexao = await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(nomeFarmacologico){
        if(nomeFarmacologico instanceof NomeFarmacologico){
            const sql = 'DELETE FROM NomeFarmacologico WHERE far_cod = ?';
            const parametros = [
              nomeFarmacologico.far_cod
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
            sql = `SELECT * FROM NomeFarmacologico WHERE far_cod = ?`;
            parametros = [termo]; 
        }
        else{
            if(!termo){
                termo = "";
            }
            sql = `SELECT * FROM NomeFarmacologico
            WHERE nome_far like ? ORDER BY far_cod`;
            parametros = ["%" + termo + "%"];
        }
        const conexao = await conectar();
        const [registros, campos] =  await conexao.execute(sql, parametros);        
        let listaNomeFarmacologico = [];
        for(const registro of registros){
            let nomeFarmacologico = new NomeFarmacologico(registro.far_cod,registro.nome_far);
            listaNomeFarmacologico.push(nomeFarmacologico);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaNomeFarmacologico;
    }

}