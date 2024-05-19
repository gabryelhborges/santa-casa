import Consumo from "../modelo/consumo.js";
import Paciente from "../modelo/paciente.js";
import Funcionario from "../modelo/funcionario.js";
import ItensConsumo from "../modelo/itensConsumo.js";
import Lote from "../modelo/lote.js";
import Loc from "../modelo/local.js";
import Singleton from "../implementacoesEngSoftware/singleton.js";
import DB from "../persistencia/db.js";

export default class ConsumoCtrl {
    //variável statica dela mesma
    s = Singleton.getInstance();

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const paciente = new Paciente(dados.paciente.idPaciente);
            const funcionario = new Funcionario(dados.funcionario.idFuncionario);

            const local = new Loc(dados.local.loc_id);
            const dataConsumo = dados.dataConsumo;
            const itensConsumo = dados.itensConsumo;
            if (paciente instanceof Paciente && funcionario instanceof Funcionario && local instanceof Loc && itensConsumo.length > 0) {
                const cons = new Consumo(0, paciente, funcionario, local, itensConsumo, dataConsumo);
                const conexao = await DB.conectar();
                try {
                    await conexao.beginTransaction();
                    cons.gravar(conexao).then(async () => {
                        //Gravou consumo(gravou= 1), entao gravar os itens
                        let atualizou = 1;
                        let gravou2 = 1;
                        let i = 0;
                        while (gravou2 && atualizou && i < itensConsumo.length) {
                            const item = itensConsumo[i];
                            let itemConsumo = new ItensConsumo(cons, item.lote, item.produto, item.qtdeConteudoUtilizado);
                            await itemConsumo.gravar(conexao).catch(() => {
                                gravou2 = 0;
                            });
                            // Decrementar o lote
                            if (gravou2) {
                                let lote = new Lote(item.lote.codigo, item.lote.data_validade, item.lote.quantidade, item.lote.produto, item.lote.formaFarmaceutica, item.lote.conteudo_frasco, item.lote.unidade, item.lote.total_conteudo, local);
                                await lote.consultar().then((listaLote) => {
                                    lote = listaLote.pop();
                                });
                                lote.total_conteudo = lote.total_conteudo - item.qtdeConteudoUtilizado;
                                lote.atualizar().catch((erro) => {
                                    atualizou = 0;
                                });
                            }
                            i++;
                        }
                        if (!gravou2 || !atualizou) {
                            if (!gravou2) {
                                throw new Error("Erro de transação. Houve um erro ao cadastrar os itens do consumo.");
                            }
                            else {
                                throw new Error("Erro de transação. Não foi possível atualizar o lote.")
                            }
                        }
                        await conexao.commit();
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": cons.idConsumo,
                            "mensagem": "Consumo cadastrado com sucesso!"
                        });
                    })
                        .catch(async (erro) => {
                            await conexao.rollback();
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": "Houve um erro ao cadastrar um consumo: " + erro.message
                            });
                        });
                }
                catch (erro) {
                    await conexao.rollback();
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro de transação, todas as alterações foram desfeitas. Erro: " + erro
                    });
                }
                finally {
                    //conexao.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos as informações de um consumo!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um consumo!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const paciente = dados.paciente;
            const funcionario = dados.funcionario;
            const dataConsumo = dados.dataConsumo;
            const itensConsumo = dados.itensConsumo;
            if (paciente instanceof Paciente && funcionario instanceof Funcionario && itensConsumo.length > 0 && dataConsumo) {
                const cons = new Consumo(0, paciente, funcionario, itensConsumo, dataConsumo);
                const conexao = await DB.conectar();
                cons.atualizar(conexao).then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Consumo atualizado com sucesso"
                    });

                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Houve um erro ao atualizar o consumo: " + erro.message
                        });
                    });

                conexao.release();
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos os dados de um consumo para atualizá-lo!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método PATCH/PUT para alterar um consumo!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        //Regra de negocio, consumo só pode ser excluído no mesmo dia em que foi realizado
        resposta.type('application/json');
        if (requisicao.method === "DELETE" && requisicao.is("application/json")) {
            const idConsumo = requisicao.body.idConsumo;
            if (idConsumo) {
                const cons = new Consumo(idConsumo);
                const conexao = await DB.conectar();

                cons.excluir(conexao).then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Consumo excluido com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir consumo: " + erro.message
                        });
                    });
                conexao.release();
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um consumo!"
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
            const cons = new Consumo();
            const conexao = await DB.conectar();
            cons.consultar(termo, conexao).then((listaConsumos) => {
                resposta.status(200).json({
                    "status": true,
                    "listaConsumos": listaConsumos
                });
            })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Ocorreu um erro ao consultar os consumos: " + erro.message + "         Stack:" + erro.stack
                    });
                });
            conexao.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar um consumo!"
            });
        }
    }


}