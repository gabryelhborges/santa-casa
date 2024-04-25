import FormaFarmaceutica from "../modelo/formaFarmaceutica.js";

export default class FormaFarmaceuticaCtrl{
    gravar(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "POST" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const forma = dados.forma;
            if(forma){
                const formaFaramaceutica = new FormaFarmaceutica(0,forma);
                formaFaramaceutica.gravar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": formaFaramaceutica.ffa_cod,
                        "mensagem": "Forma farmaceutica cadastrado com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao cadastrar uma forma farmaceutica: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a forma formaceutica!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST para cadastrar uma forma farmaceutica!"
            });
        }
    }

    atualizar(requisicao, resposta){
        resposta.type('application/json');
        if(requisicao.method === "PATCH" || requisicao.method === "PUT" && requisicao.is("application/json")){
            const dados = requisicao.body;
            const  id = dados.ffa_codd;
            const forma = dados.forma;
            if(forma){
                const formaFaramaceutica = new FormaFarmaceutica(id,forma);
                formaFaramaceutica.atualizar().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "forma faramaceutica atualizada com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao atualizar uma forma faramaceutica: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a forma faramaceutica!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método POST ou PATCH para atualizar uma forma faramaceutica!"
            });
        }
    }

    excluir(requisicao,resposta){
        resposta.type('application/json');
        if(requisicao.method === "DELETE" && requisicao.is("application/json")){
            const id = requisicao.body.ffa_cod;
            if(id){
                const formaFaramaceutica = new FormaFarmaceutica(id);
                formaFaramaceutica.excluir().then(()=>{
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "forma farmaceutica excluida com sucesso!"
                    
                    })
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Houve um erro ao excluir uma forma farmaceutica: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe a forma farmaceutica!"
                });
            }
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método DELETE para deletear uma forma farmaceutica!"
            });
        }
    }

    consultar(requisicao, resposta){
        resposta.type('application/json'); 
        let termo = requisicao.params.termo;
        if(!termo){
            termo="";
        }
        if(requisicao.method === "GET"){
            const formaFaramaceutica = new FormaFarmaceutica();
            formaFaramaceutica.consultar(termo).then((listaFormaFaramaceuticas)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaFormaFaramaceuticas": listaFormaFaramaceuticas
                });
            }).catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar unidade(s): " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Utilize o método GET para consultar alguma unidade!"
            });
        }
    }
}