import Transferencia from "../modelo/transferencia.js";
import ItensTransferencia from "../modelo/itensTransferencia.js";
import Funcionario from "../modelo/funcionario.js";
import Lote from "../modelo/lote.js";
import Loc from "../modelo/local.js";

export default class TransferenciaDAO{
    async gravar(itens, conexao){
        if(itens instanceof Transferencia){
            const sql = "INSERT INTO Transferencia(tf_func_id, tf_origem, tf_destino) values(?,?,?,?)";
            const parametros = [1,itens.origem,itens.destino];
            const retorno = await conexao.execute(sql, parametros);
            itens.tf_id = retorno[0].insertId;
        }
    }
    async excluir(itens, conexao){
        if(itens instanceof Transferencia){
            const sql = "DELETE FROM Transferencia WHERE tf_id = ?";
            const parametros = [itens.tf_id];
            await conexao.execute(sql, parametros);
        }
    }
    async consultar(termo, conexao){
        let sql="";
        let parametros = [];
        if(!isNaN(parseInt(termo))){
            sql = "SELECT * FROM transferencia WHERE tf_id = ?";
            parametros = [termo];
        }
        else{
            if(!termo){
                termo="";
            }
            sql = "SELECT * FROM transferencia ORDER BY tf_data ASC";
            parametros=[];
        }
        const [registros, campos] = await conexao.execute(sql,parametros);
        let listaTransferencias = [];
        for(const registro of registros){
            let funcionario = new Funcionario();
            await funcionario.consultar(registro.tf_func_id).then((listaFunc)=>{
                funcionario = listaFunc.pop();
            });
            let origem = new Loc();
            await origem.consultar(registro.tf_origem).then((listaOr)=>{
                origem = listaOr.pop();
            });
            let destino = new Loc();
            await origem.consultar(registro.tf_origem).then((listaDest)=>{
                destino = listaDest.pop();
            });

            let transferencia = new Transferencia(registro.tf_id,registro.tf_data,funcionario,origem,destino,[]);
            let listaItensTransferencia = [];
            let itf = new ItensTransferencia(transferencia);
            await itf.consultar(conexao).then((listaITF)=>{
                listaItensTransferencia = listaITF;
            })
            transferencia.itensTransferencia = listaItensTransferencia;
            listaTransferencias.push(transferencia);
        }
        return listaTransferencias;
    }
}
