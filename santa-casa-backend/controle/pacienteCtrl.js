import Paciente from "../modelo/paciente.js";

export default class PacienteCtrl {
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const cpf = dados.cpf;
            const nome = dados.nome;
            const raca = dados.raca;
            const estado_civil = dados.estado_civil;
            const sexo = dados.sexo;
            const data_nascimento = dados.data_nascimento || "";
            const endereco = dados.endereco || "";
            const bairro = dados.bairro || "";
            const telefone = dados.telefone || "";
            const profissao = dados.profissao || "";
            const cadastro = dados.cadastro || "";
            const numero = dados.numero || "";
            const complemento = dados.complemento || "";
            const cep = dados.cep || "";
            const naturalidade = dados.naturalidade || "";
            const nome_pai = dados.nome_pai || "";
            const nome_responsavel = dados.nome_responsavel || "";
            const nome_mae = dados.nome_mae || "";
            const nome_social = dados.nome_social || "";
            const utilizar_nome_social = dados.utilizar_nome_social || "";
            const religiao = dados.religiao || "";
            const orientacao_sexual = dados.orientacao_sexual || "";
            //Validar apenas os atributos que são NOT NULL?
            if (cpf && nome && raca && estado_civil && sexo) {
                const paciente = new Paciente(0, cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, cadastro, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual);
                paciente.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": paciente.idPaciente,
                        "mensagem": "Paciente cadastrado com sucesso!"
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar um paciente: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe os dados obrigatórios de paciente!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um paciente!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")){
            const dados = requisicao.body;
            const idPaciente = dados.idPaciente;
            const cpf = dados.cpf;
            const nome = dados.nome;
            const raca = dados.raca;
            const estado_civil = dados.estado_civil;
            const sexo = dados.sexo;
            const data_nascimento = dados.data_nascimento;
            const endereco = dados.endereco;
            const bairro = dados.bairro;
            const telefone = dados.telefone;
            const profissao = dados.profissao;
            const cadastro = dados.cadastro;
            const numero = dados.numero;
            const complemento = dados.complemento;
            const cep = dados.cep;
            const naturalidade = dados.naturalidade;
            const nome_pai = dados.nome_pai;
            const nome_responsavel = dados.nome_responsavel;
            const nome_mae = dados.nome_mae;
            const nome_social = dados.nome_social;
            const utilizar_nome_social = dados.utilizar_nome_social;
            const religiao = dados.religiao;
            const orientacao_sexual = dados.orientacao_sexual;
            if(idPaciente && cpf && nome && raca && estado_civil && sexo){
                const paciente = new Paciente(idPaciente, cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, cadastro, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual);
                paciente.atualizar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Paciente atualizado com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o paciente: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe os dados obrigatórios de paciente!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar um paciente!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "DELETE" && requisicao.is("application/json")){
            const idPaciente = requisicao.body.idPaciente;
            if(idPaciente){
                const paciente = new Paciente(idPaciente);
                paciente.excluir().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Paciente excluído com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir um cliente: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código do paciente!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um paciente!"
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
            const pac = new Paciente();
            pac.consultar(termo).then((listaPacientes)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaPacientes": listaPacientes
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar paciente(s): " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum paciente!"
            });
        }
    }
}

/*
Exemplo json paciente:

{
  "cpf": "123.456.999-10",
  "nome": "João da Silva",
  "raca": "Branca",
  "estado_civil": "S", // Solteiro
  "sexo": "M", // Masculino
  "data_nascimento": "1985-05-10",
  "endereco": "Rua das Flores, 123",
  "bairro": "Centro",
  "telefone": "(12) 3456-7890",
  "profissao": "Engenheiro",
  "numero": "123",
  "complemento": "Apartamento 101",
  "cep": "12345-678",
  "naturalidade": "São Paulo, SP",
  "nome_pai": "José da Silva",
  "nome_responsavel": "Maria Oliveira",
  "nome_mae": "Ana Souza",
  "nome_social": "João da Silva",
  "utilizar_nome_social": "N",
  "religiao": "Católica",
  "orientacao_sexual": 0 // Heterossexual
}
*/