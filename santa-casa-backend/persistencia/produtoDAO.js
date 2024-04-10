import Produto from "../modelo/produto.js";
import conectar from "./conexao.js";

export default class ProdutoDAO{
    async gravar(produto){
        if(produto instanceof Produto){
            const sql = "INSERT INTO produtos(prod_ID, Fornecedor_idFornecedor ,nome,psicotropico,valor_custo,ultima_compra,ultima_saida,observacao,descricao_uso, quantidade_total, tipo) VALUES (?,?,?,?,?,?,?,?,?,?);";
            const parametros = [ produto.prod_ID, produto.Fornecedor_idFornecedor,produto.nome,produto.psicotropico,produto.valor_custo,produto.ultima_compra,produto.ultima_saida,produto.observacao,produto.descricao_uso, produto.quantidade_total, produto.tipo];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
           // produto.prod_ID = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(produto){
        if(produto instanceof Produto){
            const sql = "UPDATE produtos SET  Fornecedor_idFornecedor  = ?,nome = ?,psicotropico = ?,valor_custo = ?,ultima_compra = ?,ultima_saida = ?,observacao = ?,descricao_uso = ?, quantidade_total = ?, tipo = ? WHERE prod_ID = ?";
            const parametros = [ produto.Fornecedor_idFornecedor,produto.nome,produto.psicotropico,produto.valor_custo,produto.ultima_compra,produto.ultima_saida,produto.observacao,produto.descricao_uso, produto.quantidade_total, produto.tipo, produto.prod_ID];
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
            const produto = new Produto(registro.prod_ID, registro.Fornecedor_idFornecedor, registro.nome, registro.psicotropico, registro.valor_custo, registro.ultima_compra,registro.ultima_saida, registro.observacao, registro.descricao_uso, registro.quantidade_total);
            listaProdutos.push(produto);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaProdutos;
    }
}