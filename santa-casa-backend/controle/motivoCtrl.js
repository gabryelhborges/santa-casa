import Motivo from "../modelo/motivo.js";

export default class MotivoCtrl{
    gravar(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const motivo = dados.motivo;
            if(motivo){
                const ObjetoMotivo = new Motivo(0,motivo);
                ObjetoMotivo.gravar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": ObjetoMotivo.motivo_id,
                        "mensagem": "Motivo cadastrado com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar uma motivo: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o motivo!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um motivo!"
            });
        }
    }

    atualizar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "PATCH" || requisicao.method === "PUT" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const  id = dados.motivo_id;
            const motivo = dados.motivo;
            if(motivo){
                const ObjetoMotivo = new Motivo(id,motivo);
                ObjetoMotivo.atualizar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "motivo atualizado com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao atualizar um motivo: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a motivo!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar um motivo!"
            });
        }
    }

    excluir(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "DELETE" && requisicao.is("application/json")){
            const id = requisicao.body.motivo_id;
            if(id){
                const ObjetoMotivo = new Motivo(id);
                ObjetoMotivo.excluir().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "motivo  excluida com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao excluir um motivo: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a motivo!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para deletear um motivo!"
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
            const ObjetoMotivo = new Motivo();
            ObjetoMotivo.consultar(termo).then((listaMotivos)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaMotivos": listaMotivos
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar motivo: " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum motivo!"
            });
        }
    }
}