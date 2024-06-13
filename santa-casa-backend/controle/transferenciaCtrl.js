import Transferencia from "../modelo/transferencia.js";
import Funcionario from "../modelo/funcionario.js";
import ItensTransferencia from "../modelo/itensTransferencia.js";
import Lote from "../modelo/lote.js";
import Produto from "../modelo/produto.js";
import Loc from "../modelo/local.js";
import Singleton from "../implementacoesEngSoftware/singleton.js";
import DB from "../persistencia/db.js";

export default class TransferenciaCtrl{
    s = Singleton.getInstance();

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const funcionario = new Funcionario(1);
            const dataAtual = new Date();

            const ano = dataAtual.getFullYear();
            const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0, então adicionamos 1
            const dia = dataAtual.getDate().toString().padStart(2, '0');

            const horas = dataAtual.getHours().toString().padStart(2, '0');
            const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
            const segundos = dataAtual.getSeconds().toString().padStart(2, '0');

            const dataTransferencia = `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
            const origem = new Loc(dados.itensTransferencia[0].origem);
            const destino = new Loc(dados.itensTransferencia[0].destino);
            const itensTransferencia = dados.itensTransferencia.map(item => new ItensTransferencia(item.produto, item.lote, item.quantidade));
            
            if (funcionario instanceof Funcionario && origem instanceof Loc && destino instanceof Loc && itensTransferencia.length > 0) {
                const transf = new Transferencia(0, dataTransferencia, funcionario, origem.loc_id, destino.loc_id, itensTransferencia);
                const conexao = await DB.conectar();
                try {
                    await conexao.beginTransaction();
                    await transf.gravar(conexao);
                    let atualizou = true;
                    let gravou2 = true;
                    let i = 0;
                    while (gravou2 && atualizou && i < itensTransferencia.length) {
                        const item = itensTransferencia[i];
                        let itemTransferencia = new ItensTransferencia(transf.tf_id, item.transf_id.prod_ID, item.prod_cod.codigo, item.lote_cod);
                        await itemTransferencia.gravar(conexao).catch(() => {
                            gravou2 = false;
                        });
                        if (gravou2) {
                            let lote1 = new Lote(item.prod_cod.codigo, item.prod_cod.data_validade, item.lote_cod, item.prod_cod.produto, item.prod_cod.formaFarmaceutica, item.prod_cod.conteudo_frasco, item.prod_cod.unidade, item.prod_cod.total_conteudo, origem);
                            await lote1.consultar().then((listaLote) => {
                                lote1 = listaLote.pop();
                            });
                            lote1.total_conteudo = lote1.total_conteudo - item.lote_cod;
                            await lote1.atualizar(conexao).catch((erro) => {
                                atualizou = false;
                            });
                            let lote2 = new Lote(item.prod_cod.codigo, item.prod_cod.data_validade, item.lote_cod, item.prod_cod.produto, item.prod_cod.formaFarmaceutica, item.prod_cod.conteudo_frasco, item.prod_cod.unidade, item.prod_cod.total_conteudo, destino);
                            let loteExiste = await lote2.consultar().then((listaLote) => listaLote.pop());

                            if (loteExiste) {
                                loteExiste.total_conteudo = loteExiste.total_conteudo + item.loc_cod;
                                await loteExiste.atualizar(conexao).catch((erro) => {
                                    atualizou = false;
                                });
                            } else {
                                lote2.total_conteudo = item.quantidade;
                                await lote2.gravar(conexao).catch((erro) => {
                                    gravou2 = false;
                                });
                            }
                        }
                        i++;
                    }
                    if (!gravou2 || !atualizou) {
                        if (!gravou2) {
                            throw new Error("Erro de transação. Houve um erro ao cadastrar os itens da transferencia.");
                        } else {
                            throw new Error("Erro de transação. Houve um erro ao atualizar os lotes da transferencia.");
                        }
                    }
                    await conexao.commit();
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": transf.tf_id,
                        "mensagem": "Transferencia cadastrada com sucesso!"
                    });
                } catch (erro) {
                    await conexao.rollback();
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar um consumo: " + erro.message
                    });
                } finally {
                    conexao.release();
                }
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar uma nova transferência!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "DELETE" && requisicao.is("application/json")) {
            const transfID = requisicao.body.tf_id;
            if (transfID) {
                const transf = new Transferencia(transfID);
                const conexao = await DB.conectar();
                try {
                    await conexao.beginTransaction();
    
                    // Consultar a transferência e os itens da transferência
                    await transf.consultar(conexao);
                    const itensTransferencia = await transf.consultarItens(conexao);
    
                    let atualizou = true;
                    let i = 0;
                    while (atualizou && i < itensTransferencia.length) {
                        const item = itensTransferencia[i];
    
                        // Reverter os estoques
                        let loteOrigem = new Lote(item.lote.codigo, item.lote.data_validade, item.lote.quantidade, item.lote.produto, item.lote.formaFarmaceutica, item.lote.conteudo_frasco, item.lote.unidade, item.lote.total_conteudo, transf.origem);
                        await loteOrigem.consultar().then((listaLote) => {
                            loteOrigem = listaLote.pop();
                        });
                        loteOrigem.total_conteudo = loteOrigem.total_conteudo + item.quantidade;
                        await loteOrigem.atualizar().catch((erro) => {
                            atualizou = false;
                        });
    
                        let loteDestino = new Lote(item.lote.codigo, item.lote.data_validade, item.lote.quantidade, item.lote.produto, item.lote.formaFarmaceutica, item.lote.conteudo_frasco, item.lote.unidade, item.lote.total_conteudo, transf.destino);
                        let loteExiste = await loteDestino.consultar().then((listaLote) => listaLote.pop());
    
                        if (loteExiste) {
                            loteExiste.total_conteudo = loteExiste.total_conteudo - item.quantidade;
                            await loteExiste.atualizar().catch((erro) => {
                                atualizou = false;
                            });
                        }
    
                        i++;
                    }
    
                    if (!atualizou) {
                        throw new Error("Erro de transação. Houve um erro ao atualizar os lotes da exclusão da transferência.");
                    }
    
                    // Excluir itens da transferência
                    for (const item of itensTransferencia) {
                        await item.excluir(conexao);
                    }
    
                    // Excluir a transferência
                    await transf.excluir(conexao);
    
                    await conexao.commit();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Transferência excluída com sucesso!"
                    });
                } catch (erro) {
                    await conexao.rollback();
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir transferência: " + erro.message
                    });
                } finally {
                    conexao.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "ID da transferência é necessário para exclusão!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir uma transferência!"
            });
        }
    }
    

    async consultar(requisicao,resposta){
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if(!termo){
            termo="";
        }
        if(requisicao.method==="GET"){
            const transf = new Transferencia();
            const conexao = await DB.conectar();
            transf.consultar(termo,conexao).then((listaTransferencia)=>{
                resposta.status(200).json({
                    "status":true,
                    "listaTransferencia":listaTransferencia
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status":false,
                    "mensagem":"Erro ao consultar transferencia: " + erro.message
                });
            });
            conexao.release();
        }
        else{
            resposta.status(400).json({
                "status":false,
                "mensagem":"Utilize o método GET para consultar uma transferência!"
            })
        }
    }
}