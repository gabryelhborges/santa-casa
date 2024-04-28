import Loc from "../modelo/local.js";

export default class localCtrl{
    gravar(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const nome = dados.loc_nome;
            if(nome){
                const lugar = new Loc(0,nome);
                lugar.gravar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": lugar.loc_id,
                        "mensagem": "Lugar cadastrado com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar um local: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o local!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um local!"
            });
        }
    }

    atualizar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "PATCH" || requisicao.method === "PUT" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const  id = dados.loc_id;
            const nome = dados.loc_nome;
            if(nome){
                const loc = new Loc(id,nome);
                loc.atualizar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Local atualizada com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao atualizar um local: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe um local!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar um local!"
            });
        }
    }

    excluir(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "DELETE" && requisicao.is("application/json")){
            const id = requisicao.body.loc_id;
            if(id){
                const locid = new Loc(id);
                locid.excluir().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Local excluida com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao excluir um local: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o local!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para deletear um local!"
            });
        }
    }

    consultar(requisicao, resposta){
        resposta.type('application/json'); 
        let termo = requisicao.params.termo;
        if(!termo){
            termo="";
        }
        if(requisicao.method === "GET"){
            const lugar = new Loc();
            lugar.consultar(termo).then((listaLocais)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaLocais": listaLocais
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar local(is): " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum local!"
            });
        }
    }
}