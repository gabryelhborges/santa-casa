import Produto from "../modelo/produto.js";
import conectar from "./conexao.js";

export default class ProdutoDAO{
    async gravar(produto){
        if(produto instanceof Produto){
            const sql = "INSERT INTO produtos(prod_ID, Fabricante_idFabricante ,nome, psicotropico, valor_custo, far_cod, observacao, descricao_uso, tipo, un_min) VALUES (?,?,?,?,?,?,?,?,?,?);";
            const parametros = [ produto.prod_ID, produto.Fabricante_idFabricante,produto.nome,produto.psicotropico,produto.valor_custo,produto.far_cod, produto.observacao,produto.descricao_uso, produto.tipo];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
           // produto.prod_ID = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(produto){
        if(produto instanceof Produto){
            const sql = "UPDATE produtos SET  Fabricante_idFabricante  = ?,nome = ?,psicotropico = ?,valor_custo = ?,far_cod = ?, observacao = ?,descricao_uso = ?, tipo = ? , un_min = ? WHERE prod_ID = ?";
            const parametros = [produto.Fabricante_idFabricante, produto.nome, produto.psicotropico, produto.valor_custo, produto.far_cod, produto.observacao, produto.descricao_uso, produto.tipo, produto.un_min, produto.prod_ID];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(produto){
        if(produto instanceof Produto){
            const sql = "DELETE FROM produtos WHERE prod_ID = ?";
            const parametro = [produto.prod_ID];
            const conexao = await conectar();
            await conexao.execute(sql, parametro);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo){
        let sql= "";
        let parametros= [];
        if(!isNaN(parseInt(termo))){
            //Se termo é um número, pesquisar por id
            sql = "SELECT * FROM produtos WHERE prod_ID = ?";
            parametros = [termo];
        }
        else{
            //Se não for número, decidir se vai buscar por cpf ou nome
            //Código busca por nome
            if(!termo){
                termo= "";
            }
            sql = "SELECT * FROM produtos WHERE nome like ? ORDER BY nome";
            parametros = ["%" + termo + "%"];
        }
        const conexao = await conectar();
        const [registros, campos]= await conexao.execute(sql, parametros);//A execução do select retornará uma lista dos registros que atendem a condição em "registros"
        let listaProdutos = [];
        //Preenchendo a lista com cada registro retornado
        for(const registro of registros){
            const produto = new Produto(registro.prod_ID, registro.Fabricante_idFabricante, registro.nome, registro.psicotropico, registro.valor_custo, registro.far_cod, registro.observacao, registro.descricao_uso, registro.tipo, registro.un_min);
            listaProdutos.push(produto);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaProdutos;
    }
}