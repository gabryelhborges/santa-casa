import Entrada from "../modelo/entrada.js";
import conectar from "../persistencia/conexao.js";

export default class EntradaCtrl{
    async gravar(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados =  requisicao.body;
            const funcionario = dados.funcionario;
            const data_entrada = dados.data_entrada;
            if(data_entrada && funcionario){
                const entrada = new Entrada(0,
                    funcionario,
                    data_entrada);
                const conexao = await conectar();
                entrada.gravar(conexao).then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": entrada.entrada_id,
                        "mensagem": "Entrada cadastrada com sucesso!"
                    
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar uma entrada: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a entrada!"
                });
            }
            
        }else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Informe todos as informações de um entrada!"
            });
        }
    }

    async atualizar(requisicao,resposta){
        resposta.type('application/json');
        if((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")){
            const dados =  requisicao.body;
            const id = dados.entrada_id;
            const funcionario = dados.funcionario;
            const data_entrada = dados.data_entrada;
            if(id && data_entrada && funcionario){
                const entrada = new Entrada(id,funcionario,data_entrada);
                const conexao = await conectar();
                entrada.atualizar(conexao).then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem":"Entrada Atualizada"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Erro na atualização da entrada:"+erro.message
                    });
                })
            }else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos os dados de uma entrada para atualizá-lo!"
                });
            }
        }else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método PATCH/PUT para alterar uma entrada!"
            });
        }
    }

    async excluir(requisicao,resposta){
        resposta.type('application/json');
        if (requisicao.method === "DELETE" && requisicao.is("application/json")) {
            const id = requisicao.body.entrada_id;
            if (id) {
                const entrada = new Entrada(id);
                const conexao = await conectar();
                entrada.excluir(conexao).then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Entrada excluido com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir a entrada: " + erro.message
                        });
                    });
                global.poolConexoes.releaseConnection(conexao);
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir uma entrada!"
            });
        }
    }

    async consultar(requisicao,resposta){
        
    }
}