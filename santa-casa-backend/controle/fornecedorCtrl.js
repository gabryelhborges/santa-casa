import Fornecedor from  "../modelo/Fornecedor.js";

export default class FornecedorCtrl{
    gravar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method = "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const cnpj = dados.cnpj;
            const f_nome = dados.f_nome;
            const endereco = dados.endereco || null;
            const numero = dados.numero || null;
            const complemento = dados.complemento || null;
            const bairro = dados.complemento || null;
            const cidade = dados.cidade || null;
            const uf = dados.uf || null;
            const telefone = dados.telefone || null;
            if(cnpj && f_nome){
                const forn = new Fornecedor(0,cnpj,f_nome,endereco,numero,complemento,bairro,cidade,uf,telefone);
                forn.gravar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": forn.idFornecedor,
                        "mensagem":"Fornecedor cadastrado com sucesso!"
                    })
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao cadastrar o fornecedor: "+erro.message
                    });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Informe os dados obrigatórios do fornecedor!"
            });
        }
    }
    else{
        resposta.status(400).json({
            "status": false,
            "mensagem": "Utilize o método POST para cadastrar um fornecedor!"
        });
    }
    }

    atualizar(requisicao,resposta) {
        resposta.type('application/json');
        if((requisicao.method === "PUT" || requisicao === "PATCH") && requisicao.is("application/json")){
            const dados = requisicao.body;
            const cnpj = dados.cnpj;
            const f_nome = dados.f_nome;
            const endereco = dados.endereco;
            const numero = dados.numero;
            const complemento = dados.complemento;
            const bairro = dados.complemento;
            const cidade = dados.cidade;
            const uf = dados.uf;
            const telefone = dados.telefone;
            if(cnpj && f_nome){
                const forn = new Fornecedor(0,cnpj,f_nome,endereco,numero,complemento,bairro,cidade,uf,telefone);
                forn.atualizar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem" : "Fornecedor Atualizado com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o fornecedor: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe os dados obrigatórios para registar o fabricante."
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar o fornecedor!"
            });
        }
    }

    excluir(requisicao,resposta) {
        resposta.type('application/json');
        if(requisicao.method === "DELETE" && requisicao.is("application/json")){
            const idFornecedor = requisicao.body.idFornecedor;
            if(idFornecedor){
                const forn = new Fornecedor(idFornecedor);
                forn.excluir().then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem": "Fornecedor Excluído com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Erro ao excluir um fornecedor: "+erro.message
                    });
                })
            }
        }
        else{
            resposta.status(400).json({
                "status":false,
                "mensagem": "Utilize o método DELETE para exlcuir um fornecedor"
            });
        }
    }

    consultar(requisicao, resposta){
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if(!termo){
            termo = "";
        }
        if(requisicao.method === "GET"){
            const forn = new Fornecedor();
            forn.consultar(termo).then((listaFornecedor)=>{
                resposta.status(200).json({
                    "status":true,
                    "listaFornecedor":listaFornecedor
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status":false,
                    "mensagem":"Erro ao consultar Fornecedor(es): "+erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum fornecedor!"
            });
        }
    }
}