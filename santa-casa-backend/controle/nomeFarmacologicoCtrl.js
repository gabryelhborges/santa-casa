import NomeFarmacologico from "../modelo/nomeFarmacologico.js";

export default class NomeFarmacologicoCtrl{
    gravar(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const nome_far = dados.nome_far;
            if(nome_far){
                const nomeFarmacologico = new NomeFarmacologico(0,nome_far);
                nomeFarmacologico.gravar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": nomeFarmacologico.far_cod,
                        "mensagem": "Nome farmacologico cadastrado com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar um Nome farmacologico: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o nome farmacologico!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um Nome farmacologico!"
            });
        }
    }

    atualizar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "PATCH" || requisicao.method === "PUT" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const  id = dados.far_cod;
            const nome_far = dados.nome_far;
            if(nome_far){
                const nomeFarmacologico = new NomeFarmacologico(id,nome_far);
                nomeFarmacologico.atualizar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "nome farmacologico atualizada com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao atualizar um nome farmacologico: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o nome farmacologico!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar um nome farmacologico"
            });
        }
    }

    excluir(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "DELETE" && requisicao.is("application/json")){
            const id = requisicao.body.far_cod;
            if(id){
                const nomeFarmacologico = new NomeFarmacologico(id);
                nomeFarmacologico.excluir().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Nome farmacologico excluido com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao excluir um Nome farmacologico: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe um Nome farmacologico!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para deletear um Nome farmacologico!"
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
            const nomeFarmacologico = new NomeFarmacologico();
            nomeFarmacologico.consultar(termo).then((listaNomeFarmacologico)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaNomeFarmacologico": listaNomeFarmacologico
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar nome(s): " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum nome!"
            });
        }
    }
}