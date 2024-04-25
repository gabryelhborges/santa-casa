import Consumo from "../modelo/consumo.js";

export default class ConsumoDAO{
    async gravar(consumo, conexao){
        if(consumo instanceof Consumo){
            const sql= "";
            const parametros= [];
            //conexao deve ser criada no control
            const retorno = await conexao.execute(sql, parametros);
            consumo.idConsumo = retorno[0].insertId;
            //releaseConnection deve ser feita no final do controle
        }
    }

    async atualizar(consumo, conexao){
        if(consumo instanceof Consumo){
            const sql = "";
            const parametros= [];
            await conexao.execute(sql, parametros);
        }
    }

    async excluir(consumo, conexao){
        if(consumo instanceof Consumo){
            const sql = "";
            const parametro = [];
            await conexao.execute(sql, parametro);
        }
    }

    async consultar(termo, conexao){
        let sql= "";
        let parametros= [];
        if(!isNaN(parseInt(termo))){
            sql = "";
            parametros = [termo];
        }
        else{
            if(!termo){
                termo= "";
            }
            sql = "";
            parametros = ["%" + termo + "%"];
        }
        const [registros, campos]= await conexao.execute(sql, parametros);
        let listaConsumos = [];
        for(const registro of registros){
            let consumo = new Consumo();//acessar registro com o nome da variavel no banco
            listaConsumos.push(consumo);
        }
        return listaConsumos;
    }
}