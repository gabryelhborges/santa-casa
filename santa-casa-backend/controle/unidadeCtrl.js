import Unidade from "../modelo/unidade.js";

export  default class UnidadeCtrl{
    gravar(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const uni = dados.unidade;
            if(uni){
                const unidade = new Unidade(0,uni);
                unidade.gravar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": unidade.un_cod,
                        "mensagem": "Unidade cadastrado com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar uma unidade: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a unidade!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar uma unidade!"
            });
        }
    }

    atualizar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "PATCH" || requisicao.method === "PUT" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const  id = dados.un_cod;
            const uni = dados.unidade;
            if(uni){
                const unidade = new Unidade(id,uni);
                unidade.atualizar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Unidade atualizada com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao atualizar uma unidade: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a unidade!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar uma unidade!"
            });
        }
    }

    excluir(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "DELETE" && requisicao.is("application/json")){
            const id = requisicao.body.un_cod;
            if(id){
                const unidade = new Unidade(id);
                unidade.excluir().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Unidade excluida com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao excluir uma unidade: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a unidade!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para deletear uma unidade!"
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
            const unidade = new Unidade();
            unidade.consultar(termo).then((listaUnidades)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaUnidades": listaUnidades
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar unidade(s): " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar alguma unidade!"
            });
        }
    }
}