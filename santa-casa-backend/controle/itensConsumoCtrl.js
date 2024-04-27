import Consumo from "../modelo/consumo.js";
import ItensConsumo from "../modelo/itensConsumo.js";
import Lote from "../modelo/lote.js";
import conectar from "../persistencia/conexao.js";

export default class ItensConsumoCtrl {
    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            let consumo = new Consumo(dados.consumo.idConsumo);
            let lote = new Lote(dados.lote.codigo);
            let qtdeConteudoUtilizado = dados.qtdeConteudoUtilizado;
            if (consumo instanceof Consumo && lote instanceof Lote && qtdeConteudoUtilizado) {
                const ic = new ItensConsumo(consumo, lote, qtdeConteudoUtilizado);
                const conexao = await conectar();
                ic.gravar(conexao).then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Item Consumo cadastrado com sucesso!"
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar um item consumo: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe os dados obrigatórios de um item consumo!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um item consumo!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")){
            const dados = requisicao.body;
            let consumo = new Consumo(dados.consumo.idConsumo);
            let lote = new Lote(dados.lote.codigo);
            let qtdeConteudoUtilizado = dados.qtdeConteudoUtilizado;
            if (consumo instanceof Consumo && lote instanceof Lote && qtdeConteudoUtilizado) {
                const ic = new ItensConsumo(consumo, lote, qtdeConteudoUtilizado);
                const conexao = await conectar();
                ic.atualizar(conexao).then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "ItemConsumo atualizado com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o item consumo: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe os dados obrigatórios de item consumo!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar um item consumo!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "DELETE" && requisicao.is("application/json")){
            let consumo = new Consumo(requisicao.body.consumo.idConsumo);
            if(consumo.idConsumo){
                const ic = new ItensConsumo(consumo);
                const conexao = await conectar();
                ic.excluir(conexao).then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Item consumo excluído com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir um item consumo: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código do item consumo!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para excluir um item consumo!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        const dados= requisicao.body;
        let idConsumo= dados.consumo.idConsumo;
        let consumo;
        idConsumo ? consumo = new Consumo(idConsumo) : consumo = null;
        let codigoLote;
        let lote;
        codigoLote ? lote = new Lote(codigoLote) : lote = null;
        if(requisicao.method === "GET"){
            const ic = new ItensConsumo(consumo, lote);
            const conexao = await conectar();
            ic.consultar(conexao).then((listaItensConsumo)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaItensConsumo": listaItensConsumo
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar itens consumo: " + erro.message + "        Stack:" + erro.stack
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum item consumo!"
            });
        }
    }
}