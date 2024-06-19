import Transferencia from "../modelo/transferencia.js";
import Funcionario from "../modelo/funcionario.js";
import ItensTransferencia from "../modelo/itensTransferencia.js";
import Lote from "../modelo/lote.js";
import Produto from "../modelo/produto.js";
import Loc from "../modelo/local.js";
import Singleton from "../implementacoesEngSoftware/singleton.js";
import DB from "../persistencia/db.js";

function formatarDataSQL(dataISO) {
    const data = new Date(dataISO);

    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0, então adicionamos 1
    const dia = data.getDate().toString().padStart(2, '0');
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');

    return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

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
                    let teste;
                    await transf.gravar(conexao).catch((erro)=>{
                        teste=1
                    });
                    let atualizou = true;
                    let gravou2 = true;
                    let i = 0;
                    while (gravou2 && atualizou && i < itensTransferencia.length) {
                        const item = itensTransferencia[i];
                        let itemTransferencia = new ItensTransferencia(transf.tf_id, item.lote_cod.codigo, item.quantidade);
                        await itemTransferencia.gravar(conexao).catch((erro) => {
                            gravou2 = false;
                        });
                        if (gravou2) {
                            let lote1 = new Lote(item.lote_cod.codigo, item.lote_cod.data_validade, item.quantidade, item.lote_cod.produto, item.lote_cod.formaFarmaceutica, item.lote_cod.conteudo_frasco, item.lote_cod.unidade, item.lote_cod.total_conteudo, destino);
                            await lote1.consultar2().then((listaLote) => {
                                lote1 = listaLote.pop();
                            });
                            lote1.local.loc_id=destino.loc_id;
                            lote1.quantidade = lote1.quantidade - item.quantidade/item.lote_cod.conteudo_frasco;
                            lote1.total_conteudo = lote1.total_conteudo - item.quantidade;
                            await lote1.atualizar2(conexao).catch((erro) => {
                                atualizou = false;
                            });
                            let lote2 = new Lote(item.lote_cod.codigo, item.lote_cod.data_validade, item.quantidade, item.lote_cod.produto, item.lote_cod.formaFarmaceutica, item.lote_cod.conteudo_frasco, item.lote_cod.unidade, item.lote_cod.total_conteudo, origem);
                            let loteExiste = await lote2.consultar2().then((listaLote) => listaLote.pop());

                            if (loteExiste) {
                                loteExiste.quantidade = loteExiste.quantidade + item.quantidade/item.lote_cod.conteudo_frasco;
                                loteExiste.total_conteudo = loteExiste.total_conteudo + item.quantidade;
                                await loteExiste.atualizar2(conexao).catch((erro) => {
                                    atualizou = false;
                                });
                            } else {
                                lote2.total_conteudo = item.lote_cod;
                                lote2.quantidade = lote2.total_conteudo/lote2.conteudo_frasco;
                                lote2.data_entrada = dataTransferencia;
                                lote2.data_validade = formatarDataSQL(lote2.data_validade);
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
            const { tf_id } = requisicao.body;
            
            if (!tf_id) {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "ID da transferência é obrigatório!"
                });
                return;
            }
    
            const conexao = await DB.conectar();
            try {
                await conexao.beginTransaction();
    
                // Buscar itens da transferência
                let itensTransferencia = new ItensTransferencia(tf_id,null,null);
                await itensTransferencia.consultar(conexao).then((listaLote) => {
                    itensTransferencia = listaLote;
                });
                if (itensTransferencia.length === 0) {
                    throw new Error("Transferência não encontrada ou não possui itens.");
                }
    
                let atualizou = true;
                let i = 0;
    
                while (atualizou && i < itensTransferencia.length) {
                    const item = itensTransferencia[i];
    
                    // Atualizar quantidade e total_conteudo dos lotes de origem e destino
                    let loteOrigem = new Lote(item.lote_cod.codigo, null, null, item.lote_cod.produto, null, null, null, null, item.lote_cod.local);
                    let loteDestino = new Lote(item.lote_cod.codigo, null, null, item.lote_cod.produto, null, null, null, null, item.lote_cod.local);

                    if(item.lote_cod.local.loc_id == 2){
                        loteOrigem.local.loc_id=1;
                    }else{
                        loteOrigem.local.loc_id=2;
                    }
                    
                    // Consultar e atualizar lote de origem
                    await loteOrigem.consultar2().then((listaLote) => {
                        loteOrigem = listaLote.pop();
                    });
                    loteOrigem.quantidade += item.quantidade/item.lote_cod.conteudo_frasco;
                    loteOrigem.total_conteudo += item.quantidade;
                    await loteOrigem.atualizar2(conexao).catch((erro) => {
                        atualizou = false;
                    });
    
                    // Consultar e atualizar lote de destino
                    await loteDestino.consultar2().then((listaLote) => {
                        loteDestino = listaLote.pop();
                    });
                    loteDestino.quantidade -= item.quantidade/item.lote_cod.conteudo_frasco;
                    loteDestino.total_conteudo -= item.quantidade;
                    await loteDestino.atualizar2(conexao).catch((erro) => {
                        atualizou = false;
                    });
    
                    if (!atualizou) break;
    
                    // Excluir item da transferência
                    await item.excluir(conexao).catch((erro) => {
                        atualizou = false;
                    });
    
                    i++;
                }
    
                if (!atualizou) {
                    throw new Error("Erro de transação. Houve um erro ao atualizar os lotes da transferência.");
                }

                let transf_excluir = new Transferencia(tf_id,null,null,null,null,null);
    
                // Excluir a transferência
                await transf_excluir.excluir(conexao).catch((erro) => {
                    throw new Error("Erro ao excluir a transferência: " + erro.message);
                });
    
                await conexao.commit();
                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Transferência excluída com sucesso!"
                });
            } catch (erro) {
                await conexao.rollback();
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Houve um erro ao excluir a transferência: " + erro.message
                });
            } finally {
                conexao.release();
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

    async getperiodos(requisicao,resposta){
        resposta.type('application/json');
        const dados = requisicao.query;

        let dataInicio = formatarDataSQL(dados.dataInicio);
        let dataFim = formatarDataSQL(dados.dataFim);

        if(requisicao.method === "GET"){
            const itTransf = new Transferencia();
            const conexao = await DB.conectar();
            itTransf.getperiodos(conexao,dataInicio,dataFim).then((listaItens)=>{
                resposta.status(200).json({
                    "status":true,
                    "listaItens":listaItens
                });
            })
                .catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Erro ao consultar transferencia por período: " + erro.message
                    });
                });
            conexao.release();
        }
        else{
            resposta.status(500).json({
                "status":false,
                "mensagem":"Utilize o método GET para consultar transferências por período!"
            });
        }
    }

    async getrecentes(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method==="GET"){
            const dataAtual = new Date();
            const ano = dataAtual.getFullYear();
            const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0, então adicionamos 1
            const dia = dataAtual.getDate().toString().padStart(2, '0');

            const horas = dataAtual.getHours().toString().padStart(2, '0');
            const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
            const segundos = dataAtual.getSeconds().toString().padStart(2, '0');

            const dataInicio = `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
            const dataFinal = `${ano}-${mes}-${dia-'1'} ${horas}:${minutos}:${segundos}`;
            if(requisicao.method === "GET"){
                const itTransf = new Transferencia();
                const conexao = await DB.conectar();
                itTransf.getperiodos(conexao,dataInicio,dataFinal).then((listaItens)=>{
                    resposta.status(200).json({
                        "status":true,
                        "listaItens":listaItens
                    });
                })
                    .catch((erro)=>{
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar transferencia: " + erro.message
                        });
                    });
                conexao.release();
            }
            else{
                resposta.status(500).json({
                    "status":false,
                    "mensagem":"Utilize o método GET para consultar transferências por período!"
                });
            }
        }
    }

    async getantigos(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method==="GET"){
            const dataAtual = new Date();
            const ano = dataAtual.getFullYear();
            const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0, então adicionamos 1
            const dia = dataAtual.getDate().toString().padStart(2, '0');

            const horas = dataAtual.getHours().toString().padStart(2, '0');
            const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
            const segundos = dataAtual.getSeconds().toString().padStart(2, '0');

            const data = `${ano}-${mes}-${dia-'1'} ${horas}:${minutos}:${segundos}`;
            if(requisicao.method === "GET"){
                const itTransf = new Transferencia();
                const conexao = await DB.conectar();
                itTransf.getantigos(conexao,data).then((listaItens)=>{
                    resposta.status(200).json({
                        "status":true,
                        "listaItens":listaItens
                    });
                })
                    .catch((erro)=>{
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar transferencia por período: " + erro.message
                        });
                    });
                conexao.release();
            }
            else{
                resposta.status(500).json({
                    "status":false,
                    "mensagem":"Utilize o método GET para consultar transferências por período!"
                });
            }
        }
    }
}