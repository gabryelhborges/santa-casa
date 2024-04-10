import Produto from "../modelo/produto.js"

export default class ProdutoCtrl {
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const prod_ID = dados.prod_ID;
            const Fornecedor_idFornecedor = dados.Fornecedor_idFornecedor;
            const nome = dados.nome;
            const psicotropico = dados.psicotropico;
            const valor_custo = dados.valor_custo;
            const ultima_compra = dados.ultima_compra || null;
            const ultima_saida = dados.ultima_saida || null;
            const observacao = dados.observacao || null;
            const descricao_uso = dados.descricao_uso || null;
            const quantidade_total = dados.quantidade_total ;
            const tipo = dados.tipo ;
            
            //Validar apenas os atributos que são NOT NULL?
            if (prod_ID && Fornecedor_idFornecedor && nome && psicotropico && valor_custo && tipo && quantidade_total) {
                const produto = new Produto(prod_ID, Fornecedor_idFornecedor, nome, psicotropico, valor_custo, ultima_compra, ultima_saida, observacao, descricao_uso, quantidade_total, tipo);
                produto.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": produto.prod_ID,
                        "mensagem": "Produto cadastrado com sucesso!"
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar um produto: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe os dados obrigatórios de produto!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um produto!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")){
            const dados = requisicao.body;
            const prod_ID = dados.prod_ID;
            const Fornecedor_idFornecedor = dados.Fornecedor_idFornecedor;
            const nome = dados.nome;
            const psicotropico = dados.psicotropico;
            const valor_custo = dados.valor_custo;
            const ultima_compra = dados.ultima_compra;
            const ultima_saida = dados.ultima_saida;
            const observacao = dados.observacao;
            const descricao_uso = dados.descricao_uso;
            const quantidade_total = dados.quantidade_total;
            const tipo = dados.tipo;
            if(Fornecedor_idFornecedor && nome && psicotropico && valor_custo && tipo && quantidade_total){
                const produto = new Produto(prod_ID, Fornecedor_idFornecedor, nome, psicotropico, valor_custo, ultima_compra, ultima_saida, observacao, descricao_uso, quantidade_total, tipo);
                produto.atualizar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Produto atualizado com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o produto: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe os dados obrigatórios de produto!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar um produto!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "DELETE" && requisicao.is("application/json")){
            const prod_ID = requisicao.body.prod_ID;
            if(prod_ID){
                const produto = new Produto(prod_ID);
                produto.excluir().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Produto excluído com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir um produto: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código do produto!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um produto!"
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo= requisicao.params.termo;
        if(!termo){
            termo= "";
        }
        if(requisicao.method === "GET"){
            const pac = new Produto();
            pac.consultar(termo).then((listaProdutos)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaProdutos": listaProdutos
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar produto(s): " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum produto!"
            });
        }
    }
}
