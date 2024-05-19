import Baixa from "../modelo/baixa.js";
import conectar from "../persistencia/conexao.js";
import Funcionario from "../modelo/funcionario.js";
import ItensBaixa from "../modelo/itensBaixa.js";
import Lote from "../modelo/lote.js";
import Loc from "../modelo/local.js";
import Singleton from "../implementacoesEngSoftware/singleton.js";


export default class BaixaCtrl {
    //variável statica dela mesma
    s = Singleton.getInstance();
    s2= Singleton.getInstance();

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;

            const funcionario = new Funcionario(dados.funcionario.idFuncionario);

            const local = new Loc(dados.local.loc_id);
            const dataBaixa = dados.dataBaixa;
            const itensBaixa = dados.itensBaixa;
            if (funcionario instanceof Funcionario && local instanceof Loc && itensBaixa.length > 0) {//&& itensBaixa.length > 0
                const baixa = new Baixa(0, itensBaixa, funcionario, dataBaixa, dataBaixa, local);
                const conexao = await conectar();
                //conexao.beginTransaction()
                baixa.gravar(conexao).then(async () => {
                    //Gravou baixa,e entao gravar os itens
                    for(const item of itensBaixa){
                        let itemBaixa = new ItensBaixa(baixa, item.produto, item.ib_idMotivo, item.ib_idQtde, item.ib_idLote, item.ib_idUnidade, item.ib_idObservacao);
                        itemBaixa.gravar(conexao);
                        //decrementar o lote
                        let lote = new Lote(item.lote.codigo, item.lote.data_validade, item.lote.quantidade, item.lote.produto,item.lote.formaFarmaceutica,item.lote.conteudo_frasco,item.lote.unidade,item.lote.total_conteudo, local);
                        await lote.consultar().then((listaLote) =>{
                            lote = listaLote.pop();
                        });
                        lote.total_conteudo= lote.total_conteudo - item.qtdeConteudoUtilizado;
                        lote.atualizar().then(()=>{}); 
                    }
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": baixa.idBaixa,
                        "mensagem": "Baixa cadastrado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Houve um erro ao cadastrar um baixa: " + erro.message
                        });
                    });
                //Onde cadastrar os itensBaixa?
                global.poolConexoes.releaseConnection(conexao);
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos as informações de um baixa!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um baixa!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const paciente = dados.paciente;
            const funcionario = dados.funcionario;
            const dataBaixa = dados.dataBaixa;
            const itensBaixa = dados.itensBaixa;
            if (paciente instanceof Paciente && funcionario instanceof Funcionario && itensBaixa.length > 0 && dataBaixa) {
                const baixa = new Baixa(0, paciente, funcionario, itensBaixa, dataBaixa);
                const conexao = await conectar();
                baixa.atualizar(conexao).then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Baixa atualizado com sucesso"
                    });

                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Houve um erro ao atualizar o baixa: " + erro.message
                        });
                    });

                global.poolConexoes.releaseConnection(conexao);
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos os dados de um baixa para atualizá-lo!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método PATCH/PUT para alterar um baixa!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        //Regra de negocio, baixa só pode ser excluído no mesmo dia em que foi realizado
        resposta.type('application/json');
        if (requisicao.method === "DELETE" && requisicao.is("application/json")) {
            const idBaixa = requisicao.body.idBaixa;
            if (idBaixa) {
                const baixa = new Baixa(idBaixa);
                const conexao = await conectar();
                baixa.excluir(conexao).then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Baixa excluido com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir baixa: " + erro.message
                        });
                    });
                global.poolConexoes.releaseConnection(conexao);
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um baixa!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = "";
        }
        if (requisicao.method === "GET") {
            const baixa = new Baixa();
            const conexao = await conectar();
            baixa.consultar(termo, conexao).then((listaBaixas) => {
                resposta.status(200).json({
                    "status": true,
                    "listaBaixas": listaBaixas
                });
            })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Ocorreu um erro ao consultar as baixas: " + erro.message + "         Stack:" + erro.stack
                    });
                });
            global.poolConexoes.releaseConnection(conexao);
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar um baixa!"
            });
        }
    }


}