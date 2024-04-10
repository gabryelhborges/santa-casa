import Fornecedor from "../modelo/Fornecedor.js";
import conectar from "./conexao.js";
export default class FornecedorDAO{
    async gravar(fornecedor){
        if(fornecedor instanceof Fornecedor){
            const sql = "INSERT INTO fornecedor(cnpj, f_nome, endereco, numero, complemento, bairro, cidade, uf, telefone) values (?,?,?,?,?,?,?,?,?);"
            const parametros = [fornecedor.cnpj, fornecedor.f_nome, fornecedor.endereco, fornecedor.numero, fornecedor.complemento, fornecedor.bairro, fornecedor.cidade, fornecedor.uf, fornecedor.telefone];
            const conn = await conectar();
            const retorno = await conn.execute(sql, parametros);
            fornecedor.idFornecedor = retorno[0].insertID;
            globalThis.poolConexoes.releaseConnection(conn);
        }
    }

    async atualizar(fornecedor){
        if(fornecedor instanceof Fornecedor){
            const sql = "UPDATE fornecedor SET cnpj = ?, f_nome = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ?, telefone = ? WHERE idFornecedor = ?";
            const parametros = [fornecedor.cnpj, fornecedor.f_nome, fornecedor.endereco, fornecedor.numero, fornecedor.complemento, fornecedor.bairro, fornecedor.cidade, fornecedor.uf, fornecedor.telefone];
            const conexao = await conectar();
            await conexao.execute(sql,parametros);
            globalThis.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(fornecedor){
        if(fornecedor instanceof Fornecedor){
            const sql = "DELETE FROM fornecedor WHERE idFornecedor = ?";
            const parametro = [fornecedor.idFornecedor];
            const conexao = await conectar();
            await conexao.execute(sql, parametro);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo){
        let sql = "";
        let parametro = [];
        if(!isNaN(parseInt(termo))){
            sql = "SELECT * FROM fornecedor WHERE idFornecedor = ?";
            parametro = [termo];
        }
        else{
            if(!termo){
                termo="";
            }
            sql = "SELECT * FROM fornecedor WHERE ifFornecedor = ?";
            parametro=["%"+termo+"%"];
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql, parametro);
        let listaFornecedor = [];
        for(const registro of registros){
            const forn = new Fornecedor(registro.idFornecedor,registro.cnpj,registro.f_nome,registro.endereco,registro.numero,registro.complemento,registro.bairro,registro.cidade,registro.uf,cidade.telefone);
            listaFornecedor.push(forn);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaFornecedor;
    }
}