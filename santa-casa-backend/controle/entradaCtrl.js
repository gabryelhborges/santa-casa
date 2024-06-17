import Entrada from "../modelo/entrada.js";
import Funcionario from "../modelo/funcionario.js";
import ItensEntrada from "../modelo/itensEntrada.js";
import Lote from "../modelo/lote.js";
import Singleton from "../implementacoesEngSoftware/singleton.js";
import DB from "../persistencia/db.js";

export default class EntradaCtrl{

    s = Singleton.getInstance();

    async gravar(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados =  requisicao.body;
            const funcionario = new Funcionario(dados.funcionario.idFuncionario);
            const data_entrada = dados.data_entrada;
            const itensEntrada = dados.itensEntrada;
            if(data_entrada && funcionario instanceof Funcionario && itensEntrada.length > 0){
                const entrada = new Entrada(0,
                    funcionario,
                    data_entrada,
                    itensEntrada
                    );
                const conexao = await DB.conectar();
                try{
                    await conexao.beginTransaction();
                    entrada.gravar(conexao).then(async() =>{
                        let atualizou = 1;
                        let gravou2 = 1;
                        let i = 0;
                        let novo = 0;
                        while (gravou2 && atualizou && i < itensEntrada.length) {
                            const item = itensEntrada[i];
                            let itemEntrada = new ItensEntrada(entrada, item.lote, item.produto, item.quantidade);
                            let lote = new Lote(item.lote.codigo, item.lote.data_validade, item.lote.quantidade, item.lote.produto, item.lote.formaFarmaceutica, item.lote.conteudo_frasco, item.lote.unidade, item.lote.total_conteudo, item.lote.local,item.lote.data_entrada);
                            await lote.consultar().then((listaLote) => {
                                if(listaLote.length==1){
                                    lote = listaLote.pop();
                                }else{
                                    novo = 1
                                }
                            });
                            if(novo){
                                lote.total_conteudo = Number(item.lote.conteudo_frasco) * Number(item.quantidade);
                                await lote.gravar(conexao).then((idLote) => {})
                            }
                            await itemEntrada.gravar(conexao).catch(() => {
                                gravou2 = 0;
                            });
                            if (gravou2 && !novo) {
                                lote.total_conteudo = Number(lote.total_conteudo) + (Number(item.lote.conteudo_frasco) * Number(item.quantidade));
                                lote.atualizar(conexao).catch((erro) => {
                                    atualizou = 0;
                                    //console.log(erro);
                                });
                            }
                            i++;
                        }
                        if (!gravou2 || !atualizou) {
                            if (!gravou2) {
                                throw new Error("Erro de transação. Houve um erro ao cadastrar os itens da entrada.");
                            }
                            else {
                                throw new Error("Erro de transação. Não foi possível atualizar o lote.")
                            }
                        }
                        await conexao.commit();
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": entrada.entrada_id,
                            "mensagem": "Entrada cadastrada com sucesso!"
                        });
                    })
                    .catch(async (erro) => {
                        await conexao.rollback();
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Houve um erro ao cadastrar uma entrada: " + erro.message
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
                    conexao.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos as informações de uma entrada!"
                });
            }
        }else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Informe todos as informações de um entrada!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        const id = requisicao.params.termo;
        if (requisicao.method === "DELETE") {
            if (id) {
                const entrada = new Entrada(id);
                const conexao = await DB.conectar();
    
                try {
                    const listaEntradas = await entrada.consultar(id, conexao);
    
                    if (listaEntradas.length === 0) {
                        resposta.status(404).json({
                            "status": false,
                            "mensagem": "Entrada não encontrada!"
                        });
                        return;
                    }
    
                    const dataEntrada = new Date(listaEntradas[0].data_entrada);
                    const now = new Date();
    
                    if (now.getTime() < dataEntrada.getTime() + 24 * 60 * 60 * 1000) {
                        await conexao.beginTransaction();
                        
                        for(let i=0;listaEntradas.itensEntrada.length<i;i++){
                            const item = listaEntradas.itensEntrada[i];
                            const lote = new Lote(
                                item.lote.codigo,
                                new Date(item.lote.data_validade),
                                item.lote.quantidade,
                                item.lote.produto,
                                item.lote.formaFarmaceutica,
                                item.lote.conteudo_frasco,
                                item.lote.unidade,
                                item.lote.total_conteudo,
                                item.lote.local,
                                new Date(item.lote.data_entrada)
                            );
                            await item.excluir(conexao);
                            
                            lote.total_conteudo = Number(lote.total_conteudo) - (Number(item.lote.conteudo_frasco) * Number(item.quantidade));

                            const loteDataEntrada = new Date(item.lote.data_entrada);
                            if (lote.total_conteudo===0 && dataEntrada.getTime() === loteDataEntrada.getTime()) {
                                await lote.excluir(conexao);
                            } else {
                                await lote.atualizar(conexao);
                            }
                        }
    
                        try {
                            await entrada.excluir(conexao);
                            await conexao.commit();
                            resposta.status(200).json({
                                "status": true,
                                "mensagem": "Entrada excluída com sucesso!"
                            });
                        } catch (erro) {
                            await conexao.rollback();
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": "Erro ao excluir entrada: " + erro.message
                            });
                        }
    
                    } else {
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": "Não é possível excluir a entrada, mais de um dia se passou!"
                        });
                    }
    
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao consultar a entrada: " + erro.message
                    });
                } finally {
                    conexao.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "ID de entrada não fornecido!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir uma entrada!"
            });
        }
    }
    
    

    async consultar(requisicao,resposta){
        resposta.type('application/json'); 
        let termo = requisicao.params.termo;
        if(!termo){
            termo="";
        }
        if(requisicao.method === "GET"){
            const entrada = new Entrada();
            const conexao = await DB.conectar();
            entrada.consultar(termo,conexao).then((listaEntradas)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaEntradas": listaEntradas
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar entrada: " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum entrada!"
            });
        }
    }

    async consultarTotal(requisicao,resposta){
        resposta.type('application/json'); 
        let termo = requisicao.params.termo;
        let id  = requisicao.query.id;
        let inicio = requisicao.query.inicio;
        let fim = requisicao.query.fim;
        const entrada = new Entrada();
        const conexao = await DB.conectar();
        entrada.consultarTotal(id,inicio,fim,conexao).then((total)=>{
            resposta.status(200).json({
                "status": true,
                "Total": total
            });
        }).catch((erro)=>{
            resposta.status(500).json({
                "status": false,
                "mensagem": "Erro ao consultar entrada: " + erro.message
            });
        });
       
    }

    async consultarTotalItens(requisicao,resposta){
        resposta.type('application/json'); 
        let id  = requisicao.query.id;
        let inicio = requisicao.query.inicio;
        let fim = requisicao.query.fim;
        const entrada = new Entrada();
        const conexao = await DB.conectar();
        entrada.consultarTotalItens(id,inicio,fim,conexao).then((total)=>{
            resposta.status(200).json({
                "status": true,
                "Total": total
            });
        }).catch((erro)=>{
            resposta.status(500).json({
                "status": false,
                "mensagem": "Erro ao consultar entrada: " + erro.message
            });
        });
    }

    async consultarUltima(requisicao,resposta){
        resposta.type('application/json'); 
        let id  = requisicao.query.id;
        let inicio = requisicao.query.inicio;
        let fim = requisicao.query.fim;
        const entrada = new Entrada();
        const conexao = await DB.conectar();
        entrada.consultarUltima(id,inicio,fim,conexao).then((entrada)=>{
            resposta.status(200).json({
                "status": true,
                "entrada": entrada
            });
        }).catch((erro)=>{
            resposta.status(500).json({
                "status": false,
                "mensagem": "Erro ao consultar entrada: " + erro.message
            });
        });
    }

    async consultarNovosLotes(requisicao,resposta){
        resposta.type('application/json');
        let id  = requisicao.query.id;
        let inicio = requisicao.query.inicio;
        let fim = requisicao.query.fim;
        const entrada = new Entrada();
        const conexao = await DB.conectar();
        entrada.consultarNovosLotes(id,inicio,fim,conexao).then((entrada)=>{
            resposta.status(200).json({
                "status": true,
                "entrada": entrada
            });
        }).catch((erro)=>{
            resposta.status(500).json({
                "status": false,
                "mensagem": "Erro ao consultar entrada: " + erro.message
            });
        });
    }

    async consultarNovosLotes(requisicao,resposta){
        resposta.type('application/json');
        let id  = requisicao.query.id;
        let inicio = requisicao.query.inicio;
        let fim = requisicao.query.fim;
        const entrada = new Entrada();
        const conexao = await DB.conectar();
        entrada.consultarNovosLotes(id,inicio,fim,conexao).then((entrada)=>{
            resposta.status(200).json({
                "status": true,
                "entrada": entrada
            });
        }).catch((erro)=>{
            resposta.status(500).json({
                "status": false,
                "mensagem": "Erro ao consultar entrada: " + erro.message
            });
        });
    }

    async consultar2(requisicao,resposta){
        resposta.type('application/json'); 
        let prod  = requisicao.query.prod;
        let lote = requisicao.query.lote;

        if(requisicao.method === "GET"){
            const entrada = new Entrada();
            const conexao = await DB.conectar();
            entrada.consultar2(prod,lote,conexao).then((listaEntradas)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaEntradas": listaEntradas
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar entrada: " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum entrada!"
            });
        }
    }

}