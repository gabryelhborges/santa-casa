import Consumo from "../modelo/consumo.js";
import Paciente from "../modelo/paciente.js";
import conectar from "../persistencia/conexao.js";
import Funcionario from  "../modelo/funcionario.js";


export default class ConsumoCtrl{
    async gravar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const paciente = dados.paciente;
            const funcionario = dados.funcionario;//já recebo um objeto? ou devo instanciá-lo aqui?
            const dataConsumo = dados.dataConsumo;
            const itensConsumo = dados.itensConsumo;
            if(paciente instanceof Paciente && funcionario instanceof Funcionario && itensConsumo.length > 0 && dataConsumo){
                const cons = new Consumo(0, paciente, funcionario, itensConsumo, dataConsumo);
                const conexao = await conectar();
                //conexao.beginTransaction()
                cons.gravar(conexao).then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": cons.idConsumo,
                        "mensagem": "Consumo cadastrado com sucesso!"
                    })
                    .catch((erro)=>{
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Houve um erro ao cadastrar um consumo: " + erro.message
                        });
                    });
                });
                //Onde cadastrar os itensConsumo?
                global.poolConexoes.releaseConnection(conexao);
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos as informações de um consumo!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um consumo!"
            });
        }
    }

    async atualizar(requisicao, resposta){
        resposta.type('application/json');
        if((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")){
            const dados = requisicao.body;
            const paciente = dados.paciente;
            const funcionario = dados.funcionario;//já recebo um objeto? ou devo instanciá-lo aqui?
            const dataConsumo = dados.dataConsumo;
            const itensConsumo = dados.itensConsumo;
            if(paciente instanceof Paciente && funcionario instanceof Funcionario && itensConsumo.length > 0 && dataConsumo){
                const cons = new Consumo(0, paciente, funcionario, itensConsumo, dataConsumo);
                const conexao = await conectar();
                cons.atualizar(conexao).then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Consumo atualizado com sucesso"
                    })
                    .catch((erro)=>{
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Houve um erro ao atualizar o consumo: " + erro.message
                        });
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos os dados de um consumo para atualizá-lo!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método PATCH/PUT para alterar um consumo!"
            });
        }
    }

    async excluir(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "DELETE" && requisicao.is("application/json")){
            const idConsumo = requisicao.body.idConsumo;
            if(idConsumo){
                const cons = new Consumo(idConsumo);
                const conexao = await conectar();
                cons.excluir(conexao).then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Consumo excluido com sucesso!"
                    });
                })
                .catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir consumo: " + erro.message
                    });
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um consumo!"
            });
        }
    }

    async consultar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "GET"){

        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar um consumo!"
            });
        }
    }


}