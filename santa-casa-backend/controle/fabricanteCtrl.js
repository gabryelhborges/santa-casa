import Fabricante from  "../modelo/fabricante.js";

export default class FabricanteCtrl{
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
                const forn = new Fabricante(0,cnpj,f_nome,endereco,numero,complemento,bairro,cidade,uf,telefone);
                forn.gravar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": forn.idFabricante,
                        "mensagem":"Fabricante cadastrado com sucesso!"
                    })
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao cadastrar o fabricante: "+erro.message
                    });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Informe os dados obrigatórios do fabricante!"
            });
        }
    }
    else{
        resposta.status(400).json({
            "status": false,
            "mensagem": "Utilize o método POST para cadastrar um fabricante!"
        });
    }
    }

    atualizar(requisicao,resposta) {
        resposta.type('application/json');
        if((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")){
            const dados = requisicao.body;
            const idFabricante = dados.idFabricante;
            const cnpj = dados.cnpj;
            const f_nome = dados.f_nome;
            const endereco = dados.endereco;
            const numero = dados.numero;
            const complemento = dados.complemento;
            const bairro = dados.complemento;
            const cidade = dados.cidade;
            const uf = dados.uf;
            const telefone = dados.telefone;
            if(idFabricante && cnpj && f_nome){
                const forn = new Fabricante(idFabricante,cnpj,
                    f_nome,endereco,numero,complemento,bairro,
                    cidade,uf,telefone);
                forn.atualizar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem" : "Fabricante Atualizado com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o fabricante: " + erro.message
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
                "mensagem": "Utilize o método POST ou PATCH para atualizar o fabricante!"
            });
        }
    }

    excluir(requisicao,resposta) {
        resposta.type('application/json');
        if(requisicao.method === "DELETE" && requisicao.is("application/json")){
            const idFabricante = requisicao.body.idFabricante;
            if(idFabricante){
                const forn = new Fabricante(idFabricante);
                forn.excluir().then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem": "Fabricante Excluído com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Erro ao excluir um fabricante: "+erro.message
                    });
                })
            }
        }
        else{
            resposta.status(400).json({
                "status":false,
                "mensagem": "Utilize o método DELETE para exlcuir um fabricante"
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
            const forn = new Fabricante();
            forn.consultar(termo).then((listaFabricante)=>{
                resposta.status(200).json({
                    "status":true,
                    "listaFabricante":listaFabricante
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status":false,
                    "mensagem":"Erro ao consultar Fabricante(es): "+erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum fabricante!"
            });
        }
    }
}