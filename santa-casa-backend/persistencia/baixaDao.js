import Baixa from "../modelo/baixa.js";
import ItensBaixa from "../modelo/itensBaixa.js"
import Funcionario from "../modelo/funcionario.js";

export default class BaixaDAO{
    async gravar(baixa, conexao){
        if(baixa instanceof Baixa){
            const sql= "INSERT INTO Baixa(b_idFuncionario, b_locId) VALUES(?,?)";
            const parametros= [baixa.funcionario.idFuncionario, baixa.local.loc_id];
            //conexao deve ser criada no control
            const retorno = await conexao.execute(sql, parametros);
            baixa.idBaixa = retorno[0].insertId;
            //releaseConnection deve ser feita no final do controle
        }
    }

    async atualizar(baixa, conexao){
        if(baixa instanceof Baixa){
            const sql = "UPDATE Baixa SET b_idFuncionario = ?, cons_dataBaixa = ? local = ? WHERE idBaixa = ?";
            const parametros = [baixa.funcionario.idFuncionario, baixa.dataBaixa, baixa.idBaixa, baixa.local];
            await conexao.execute(sql, parametros);
        }
    }

    async excluir(baixa, conexao){
        if(baixa instanceof Baixa){
            const sql = "DELETE FROM Baixa WHERE idBaixa = ?";
            const parametro = [baixa.idBaixa];
            await conexao.execute(sql, parametro);
        }
    }

    async consultar(termo, conexao){
        let sql= "";
        let parametros= [];
        if(!isNaN(parseInt(termo))){
            sql = "SELECT * FROM Baixa WHERE idBaixa = ?";
            parametros = [termo];
        }
        else{
            //pesquisar por data
            if(!termo){
                termo= "";
            }
            sql = "SELECT * FROM Baixa ORDER BY dataBaixa ASC";
            parametros = [];
        }
        const [registros, campos]= await conexao.execute(sql, parametros);
        let listaBaixas = [];
        for(const registro of registros){
          
            let funcionario = new Funcionario();
            await funcionario.consultar(registro.b_idFuncionario).then((listaFunc)=>{
                funcionario = listaFunc.pop();
            });

            let baixa = new Baixa(registro.idBaixa, [], funcionario, registro.dataBaixa);
            let listaItensBaixa = [];
            let ib = new ItensBaixa(baixa);
            await ib.consultar(conexao).then((listaIB)=>{
                listaItensBaixa = listaIB;
            })
            baixa.itensBaixa = listaItensBaixa;

            listaBaixas.push(baixa);
        }
        return listaBaixas;
    }
}