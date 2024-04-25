import Lote from "../modelo/lote.js";


export default class LoteCtrl{
    async gravar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const data_validade = dados.data_validade;
            const quantidade = dados.quantidade;
            const produto = dados.produto;
            const formaFaramaceutica = dados.formaFaramaceutica;
            const conteudo_frasco = dados.conteudo_frasco;
            const unidade = dados.conteudo_frasco;
            const total_conteudo = dados.total_conteudo;

            if(
            codigo && data_validade && quantidade 
            && produto && formaFaramaceutica && conteudo_frasco
            && unidade  && total_conteudo
            ) {  
                const lote = new Lote( codigo, data_validade, quantidade, 
                produto, formaFaramaceutica, conteudo_frasco, 
                unidade , total_conteudo);
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
        
    }

    async excluir(requisicao, resposta){
        
    }

    async consultar(requisicao, resposta){
        
    }
}