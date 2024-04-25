import Unidade from "../modelo/unidade.js";
import conectar from "./conexao.js";

export default class UnidadeDAO{

    async gravar(unidade){
        if(unidade instanceof Unidade){
            const sql = `INSERT INTO
            unidade (unidade) VALUES(?);`;
            const parametros = [
                unidade.unidade
            ];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            unidade.un_cod = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);

        }
    }

    async atualizar(unidade){
        if(unidade instanceof Unidade){
            let sql = 'UPDATE unidade SET unidade = ? WHERE un_cod = ?';
            const parametros = [
                unidade.unidade,
                unidade.un_cod
            ];
            const  conexao = await conectar();
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(unidade){
        if(unidade instanceof Unidade){
            const  sql= `DELETE FROM
             unidade WHERE un_cod = ?
            `;
            const parametros=[
               unidade.un_cod
            ];
            const conexao = await conectar() ;
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo){
        let sql = "";
        let parametros = [];
        if(!isNaN(parseInt(termo))){
            sql = `SELECT * FROM  unidade WHERE un_cod = ?`;
            parametros = [termo];
        }
        else{
            if(!termo){
                termo = "";
            }
            sql = "SELECT * FROM unidade WHERE unidade LIKE ?  ORDER BY un_cod";
            parametros = ["%" + termo + "%"];
        }
        const conexao = await  conectar();
        const [registros, campos] =await conexao.execute(sql , parametros);
        let listaUnidades = [];
        for(const registro of registros){
            let unidade = new Unidade(registro.un_cod,registro.unidade);
            listaUnidades.push(unidade);
        }
        global.poolConexoes.releaseConnection(conexao)
        return listaUnidades;
    }
}