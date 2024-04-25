import FormaFarmaceutica from "../modelo/formaFarmaceutica.js"
import conectar from "./conexao.js";

export default class FormaFarmaceuticaDAO{
    async gravar(formaFaramaceutica){
        if(formaFaramaceutica instanceof FormaFarmaceutica){
            const sql = "INSERT INTO formafarmaceutica (forma) VALUES(?)";
            const parametros = [
                formaFaramaceutica.forma
            ]
            const conexao = await conectar();
            const retorno = await conexao.execute(sql,parametros);
            formaFaramaceutica.ffa_cod = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(formaFaramaceutica){
        if(formaFaramaceutica instanceof FormaFarmaceutica){
            const sql = `UPDATE  formafarmaceutica SET 
            forma=? WHERE ffa_cod=?`;
            const parametros = [
                formaFaramaceutica.forma,
                formaFaramaceutica.ffa_cod
            ]
            const conexao = await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(formaFaramaceutica){
        if(formaFaramaceutica instanceof FormaFarmaceutica){
            const sql = 'DELETE FROM formafarmaceutica WHERE ffa_cod = ?';
            const parametros = [
              formaFaramaceutica.ffa_cod
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
            sql = `SELECT * FROM formafarmaceutica WHERE ffa_cod = ?`;
            parametros = [termo]; 
        }
        else{
            if(!termo){
                termo = "";
            }
            sql = `SELECT * FROM formafarmaceutica
            WHERE forma like ? ORDER BY ffa_cod`;
            parametros = ["%" + termo + "%"];
        }
        const conexao = await conectar();
        const [registros, campos] =  await conexao.execute(sql, parametros);        
        let listaFormaFaramaceuticas = [];
        for(const registro of registros){
            let formaFaramaceutica = new FormaFarmaceutica(registro.ffa_cod,registro.forma);
            listaFormaFaramaceuticas.push(formaFaramaceutica);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaFormaFaramaceuticas;
    }

}