import Funcionario from "../modelo/funcionario.js";

export default class FuncionarioCtrl{
    gravar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const nome_funcionario = dados.nome_funcionario;
            const farmaceutico = dados.farmaceutico || null;
            const coren = dados.coren || null;
            const cpf = dados.cpf;
            const telefone_funcionario = dados.telefone_funcionario || null;
            if(nome_funcionario && cpf){
                const funcionario = new Funcionario(0,nome_funcionario,farmaceutico,coren,cpf,telefone_funcionario);
                funcionario.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": funcionario.idFuncionario,
                        "mensagem": "Funcionario cadastrado com sucesso!"
                    })
                }).catch((erro) => {//aqui
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar um funcionario: " + erro.message
                    });
                });

            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe os dados obrigatórios do funcionario!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um funcionario!"
            });
        }
    }

    atualizar(requisicao, resposta){
        resposta.type('application/json');
        if((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")){
            const dados = requisicao.body;
            const  idFuncionario = dados.idFuncionario
            const nome_funcionario = dados.nome_funcionario;
            const farmaceutico = dados.farmaceutico;
            const coren = dados.coren;
            const cpf = dados.cpf;
            const telefone_funcionario = dados.telefone_funcionario;
            if(idFuncionario && nome_funcionario && cpf){
                const funcionario = new Funcionario( idFuncionario,nome_funcionario,farmaceutico,coren,cpf,telefone_funcionario);
                funcionario.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Funcionario atualizado com sucesso!"
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao atualizar um funcionario: " + erro.message
                    });
                });

            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe os dados obrigatórios do funcionario!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar um funcionario!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "DELETE" && requisicao.is("application/json")){
            const idFuncionario = requisicao.body.idFuncionario;
            if(idFuncionario){
                const funcionario = new Funcionario(idFuncionario);
                funcionario.excluir().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Funcionario excluído com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir um funcionario: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código do funcionario!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um funcionario!"
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
            const fun = new Funcionario();
            fun.consultar(termo).then((listaFuncionarios)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaFuncionarios": listaFuncionarios
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar funcionario(s): " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum funcionario!"
            });
        }
    }


}
/*
    #idFuncionario;
    #nome_funcionario;
    #farmaceutico;
    #coren;
    #cpf;
    #telefone_funcionario;
*/