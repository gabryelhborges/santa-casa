import Transferencia from "../modelo/transferencia.js";
import ItensTransferencia from "../modelo/itensTransferencia.js";
import Lote from "../modelo/lote.js";
import Produto from "../modelo/produto.js";
import conectar from "../persistencia/conexao.js";

export default class ItensTransferenciaCtrl {
    async gravar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            let transferencia = new Transferencia(dados.transferencia.tf_id);
            let produto = new Produto(dados.produto.prod_ID);
            let lote = new Lote(dados.lote.codigo);
            let qtde = dados.quantidade;
            if(transferencia instanceof Transferencia && produto instanceof Produto && lote instanceof Lote && qtde){
                const itf = new ItensTransferencia(transferencia,produto,lote,quantidade);
                const conexao = await conectar();
                itf.gravar(conexao).then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem":"Item da Transferencia gravado com sucesso!"
                    })
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Houve um erro ao cadastrar um item da transferencia"+erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Utilize o método POST para cadastrar itens de uma transferência"
                });
            }
        }
    }

    // não precisa de atualizar também.

    async excluir(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "DELETE" && requisicao.is('application/json')){
            let transferencia = new Transferencia(requisicao.body.transferencia.tf_id);
            if(transferencia.tf_id){
                const itf = new ItensTransferencia(transferencia);
                const conexao = await conectar();
                itf.excluir(conexao).then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem":"Item da Transferencia excluido com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Houve um erro ao excluir um item da transferencia"+erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Utilize o método DELETE para excluir itens de uma transferência"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status":false,
                "mensagem":"Utilize o método DELETE para excluir itens de uma transferência"
            });
        }
    }

    async consultar(requisicao,resposta){
        resposta.type('application/json');
        const dados = requisicao.body;
        let TransfId = dados.transferencia.tf_id;
        let transf;
        TransfId ? transf = new Transferencia(TransfId) : transf = null;
        let codigoLote = dados.lote.codigo;
        let lote;
        codigoLote ? lote = new Lote(codigoLote) : lote=null;
        let codigoProduto = dados.produto.prod_ID;
        let produto;
        codigoProduto ? produto = new Produto(codigoProduto) : produto=null;
        if(requisicao.method === "GET"){
            const itf = new ItensTransferencia(transf,produto,lote);
            const conexao = await conectar();
            itf.consultar(conexao)>then((listaItensTransferencia)=>{
                resposta.status(200).json({
                    "status":true,
                    "mensagem":listaItensTransferencia
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status":false,
                    "mensagem":"Erro ao consultar itens da transferencia"+erro.message+"    Stack:"+erro.stack
                });
            });
        }
        else{
            resposta.status(400).json({
                "status":false,
                "mensagem":"Utilize o método GET para consultar itens de uma transferência"
            });
        }
    }
}