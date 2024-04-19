import Fabricante from "../modelo/fabricante.js";
import conectar from "./conexao.js";
export default class FabricanteDAO{
    async gravar(fabricante){
        if(fabricante instanceof Fabricante){
            const sql = "INSERT INTO fabricante(cnpj, f_nome, endereco, numero, complemento, bairro, cidade, uf, telefone) values (?,?,?,?,?,?,?,?,?);"
            const parametros = [fabricante.cnpj, fabricante.f_nome, fabricante.endereco, fabricante.numero, fabricante.complemento, fabricante.bairro, fabricante.cidade, fabricante.uf, fabricante.telefone];
            const conn = await conectar();
            const retorno = await conn.execute(sql, parametros);
            fabricante.idFabricante = retorno[0].insertID;
            global.poolConexoes.releaseConnection(conn);
        }
    }

    async atualizar(fabricante){
        if(fabricante instanceof Fabricante){
            const sql = "UPDATE fabricante SET cnpj = ?, f_nome = ?,\
             endereco = ?, numero = ?, complemento = ?, bairro = ?,\
              cidade = ?, uf = ?, telefone = ? WHERE idFabricante = ?";
            const parametros = [fabricante.cnpj,
                 fabricante.f_nome,
                  fabricante.endereco,
                   fabricante.numero,
                    fabricante.complemento,
                     fabricante.bairro,
                      fabricante.cidade,
                       fabricante.uf,
                        fabricante.telefone,
                         fabricante.idFabricante];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql,parametros);
            fabricante.idFabricante = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(fabricante){
        if(fabricante instanceof Fabricante){
            const sql = "DELETE FROM fabricante WHERE idFabricante = ?";
            const parametro = [fabricante.idFabricante];
            const conexao = await conectar();
            await conexao.execute(sql, parametro);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo){
        let sql = "";
        let parametro = [];
        if(!isNaN(parseInt(termo))){
            sql = "SELECT * FROM fabricante WHERE idFabricante = ?";
            parametro = [termo];
        }
        else{
            if(!termo){
                termo="";
            }
            sql = "SELECT * FROM fabricante WHERE f_nome like ? ORDER BY f_nome";
            parametro = ["%" + termo + "%"];
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql, parametro);
        let listaFabricante = [];
        for(const registro of registros){
            const forn = new Fabricante(registro.idFabricante,registro.cnpj,registro.f_nome,registro.endereco,registro.numero,registro.complemento,registro.bairro,registro.cidade,registro.uf,registro.telefone);
            listaFabricante.push(forn);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaFabricante;
    }
}