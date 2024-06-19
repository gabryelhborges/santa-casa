import Transferencia from "../modelo/transferencia.js";
import ItensTransferencia from "../modelo/itensTransferencia.js";
import Funcionario from "../modelo/funcionario.js";
import Lote from "../modelo/lote.js";
import Loc from "../modelo/local.js";

export default class TransferenciaDAO{
    async gravar(itens, conexao){
        if(itens instanceof Transferencia){
            const sql = "INSERT INTO transferencia(tf_func_id, tf_origem, tf_destino) values (?,?,?)";
            const parametros = [1,itens.tf_origem,itens.tf_destino];
            const retorno = await conexao.execute(sql, parametros);
            itens.tf_id = retorno[0].insertId;
        }
    }
    async excluir(itens, conexao){
        if(itens instanceof Transferencia){
            const sql = "DELETE FROM transferencia WHERE tf_id = ?";
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
            await destino.consultar(registro.tf_destino).then((listaDest)=>{
                destino = listaDest.pop();
            });

            let transferencia = new Transferencia(registro.tf_id,registro.tf_data,funcionario,origem,destino,[]);
            let listaItensTransferencia = [];
            let itf = new ItensTransferencia(transferencia.tf_id,null,null,null);
            await itf.consultar(conexao).then((listaITF)=>{
                listaItensTransferencia = listaITF;
            })
            listaTransferencias.push(transferencia);
            transferencia.itensTransferencia = listaItensTransferencia;
        }
        return listaTransferencias;
    }

    //getperiodos, getantigos

    async getperiodos(conexao,data1,data2){ //serve pro getrecentes também
        let sql="";
        let parametros = [];
        if(data1 && data2){
            sql = "SELECT * FROM transferencia WHERE tf_data BETWEEN ? AND ?";
            parametros = [data2,data1];
        }
        else{
            if(!data1){
                data1="";
            }
            if(!data2){
                data2="";
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
            await destino.consultar(registro.tf_destino).then((listaDest)=>{
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

    async getantigos(conexao,data){
        let sql="";
        let parametros = [];
        if(data){
            sql = "SELECT * FROM transferencia WHERE tf_data < ?";
            parametros = [data];
        }
        else{
            data="";
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
            await destino.consultar(registro.tf_destino).then((listaDest)=>{
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
