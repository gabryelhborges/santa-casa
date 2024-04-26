import Consumo from "../modelo/consumo.js";
import Funcionario from "../modelo/funcionario.js";
import Paciente from "../modelo/paciente.js";

export default class ConsumoDAO{
    async gravar(consumo, conexao){
        if(consumo instanceof Consumo){
            const sql= "INSERT INTO Consumo(cons_pac_id, cons_func_id, cons_dataConsumo) VALUES(?,?,?)";
            const parametros= [consumo.paciente.idPaciente, consumo.funcionario.idFuncionario, consumo.dataConsumo];
            //conexao deve ser criada no control
            const retorno = await conexao.execute(sql, parametros);
            consumo.idConsumo = retorno[0].insertId;
            //releaseConnection deve ser feita no final do controle
        }
    }

    async atualizar(consumo, conexao){
        if(consumo instanceof Consumo){

        }
    }

    async excluir(consumo, conexao){
        if(consumo instanceof Consumo){
            const sql = "DELETE FROM Consumo WHERE cons_id = ?";
            const parametro = [consumo.idConsumo];
            await conexao.execute(sql, parametro);
        }
    }

    async consultar(termo, conexao){
        let sql= "";
        let parametros= [];
        if(!isNaN(parseInt(termo))){
            sql = "SELECT * FROM Consumo WHERE cons_id = ?";
            parametros = [termo];
        }
        else{
            //pesquisar por data
            if(!termo){
                termo= "";
            }
            sql = "SELECT * FROM Consumo WHERE cons_dataConsumo = ?";
            parametros = [termo];
        }
        const [registros, campos]= await conexao.execute(sql, parametros);
        let listaConsumos = [];
        for(const registro of registros){
            let paciente = new Paciente();
            //terminar
            let funcionario = new Funcionario(registro.cons_func_id);
            let consumo = new Consumo(registro.cons_id, paciente, funcionario, null, registro.cons_dataConsumo);//acessar registro com o nome da variavel no banco
            listaConsumos.push(consumo);
        }
        return listaConsumos;
    }
}