import Lote from "../modelo/lote.js";
import Produto from "../modelo/produto.js";


export default class LoteCtrl{
    gravar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const data_validade = dados.data_validade;
            const quantidade = dados.quantidade;
            const produto = dados.produto;
            const formaFarmaceutica = dados.formaFarmaceutica;
            const conteudo_frasco = dados.conteudo_frasco;
            const unidade = dados.unidade;
            const total_conteudo = dados.total_conteudo;
            const local = dados.local;
            const data_entrada = dados.data_entrada;

            if( codigo && data_validade && quantidade 
            && produto && formaFarmaceutica && conteudo_frasco
            && unidade  && total_conteudo &&  local && data_entrada) 
            {  
                const lote = new Lote( codigo, data_validade, quantidade, 
                produto, formaFarmaceutica, conteudo_frasco, 
                unidade , total_conteudo, local, data_entrada);
                lote.gravar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Lote cadastrado com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar um lote: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o lote!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar um lote!"
            });
        }
    }

    async atualizar(requisicao, resposta){
        resposta.type('application/json');
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")){
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const data_validade = dados.data_validade;
            const quantidade = dados.quantidade;
            const produto = dados.produto;
            const formaFarmaceutica = dados.formaFarmaceutica;
            const conteudo_frasco = dados.conteudo_frasco;
            const unidade = dados.unidade;
            const total_conteudo = dados.total_conteudo;
            const local = dados.local;
            const data_entrada = dados.data_entrada;

            if(
                codigo && data_validade && quantidade 
                && produto && formaFarmaceutica && conteudo_frasco
                && unidade  && total_conteudo && local && data_entrada
                ) {  
                    const lote = new Lote( codigo, data_validade, quantidade, 
                    produto, formaFarmaceutica, conteudo_frasco, 
                    unidade , total_conteudo,local,data_entrada);
                    lote.atualizar().then(()=>{
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Lote atualizado com sucesso!"
                        
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Houve um erro ao atualizar um lote: " + erro.message
                        });
                    });
                }
                else{
                    resposta.status(400).json({
                        "status": false,
                        "mensagem": "Informe o lote!"
                    });
                }
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Utilize o método POST ou PATCH para atualizar um lote!"
                });
            }
    }

    async excluir(requisicao, resposta){
        resposta.type('application/json');
        if (requisicao.method === "DELETE" && requisicao.is("application/json")){
            const codigo = requisicao.body.codigo;
            const produto= requisicao.body.produto;
            if(codigo && produto){
                const lote = new Lote(codigo,null,null,produto);
                lote.excluir().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Lote excluído com sucesso!"
                    });
                }).catch((erro)=>{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir um lote: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o código do lote!"
                });
            }
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        if(requisicao.method === "GET"){
            let codigo = requisicao.query.codigo;
            let prod = requisicao.query.produto;
            let produto;
            if(!codigo)
                codigo = "";
            if(prod)
                produto = new Produto(prod);
            else
                produto = null;
            const lote = new Lote(codigo,null,null,produto);
            lote.consultar().then((listaLotes)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaLotes": listaLotes
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar lote(s): " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar algum lote!"
            });
        }
    }
}