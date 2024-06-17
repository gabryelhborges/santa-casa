import Entrada from "../modelo/entrada.js";
import Funcionario from "../modelo/funcionario.js";
import ItensEntrada from "../modelo/itensEntrada.js";
import Lote from "../modelo/lote.js";
import Produto from "../modelo/produto.js";

export  default class EntradaDAO {
    async gravar(entrada,conexao){
        const sql = "INSERT INTO entrada(entrada_funcionario_id ,data_entrada) VALUES(?, ?)";
        const parametros = [entrada.funcionario.idFuncionario
                           ,entrada.data_entrada];
        const retorno = await conexao.execute(sql,parametros);
        entrada.entrada_id = retorno[0].insertId;
    }
    
    async atualizar(entrada, conexao){
        const  sql = `UPDATE entrada SET entrada_funcionario_id = ?, data_entrada = ? WHERE entrada_id=?`;
        const parametros = [entrada.funcionario.idFuncionario,
                          entrada.data_entrada, 
                          entrada.entrada_id];
        await conexao.execute(sql, parametros);
    }

    async excluir (entrada,conexao){
        const sql = `DELETE FROM entrada WHERE entrada_id = ?` ;
        const parametros = [ entrada.entrada_id];
        await conexao.execute(sql,parametros);
    }

    async consultar(termo,conexao){
        let sql = "";
        let parametros = [];
        if(!isNaN(parseInt(termo))){
            sql = 'SELECT * FROM entrada WHERE entrada_id = ?';
            parametros = [termo];
        }else{
            if(!termo){
                termo = "";
            }
            sql = `SELECT * FROM entrada WHERE data_entrada like ? ORDER BY  data_entrada ASC`;
            parametros = ['%'+ termo +'%'];
        }
        const [registros, campos]= await conexao.execute(sql, parametros);
        let listaEntradas = [];
        for(const registro of registros){
            let funcionario = new Funcionario();
            await funcionario.consultar(registro.entrada_funcionario_id).then((listaFunc)=>{
                funcionario = listaFunc.pop();
            });

            let entrada = new Entrada(registro.entrada_id, funcionario,registro.data_entrada,[]);
            let lista_ItensEntradas = [];
            let itensEntrada = new ItensEntrada(entrada);
            await itensEntrada.consultar(conexao).then((listaItensEntradas)=>{
                lista_ItensEntradas = listaItensEntradas;
            })
            entrada.itensEntrada = lista_ItensEntradas;
            
            listaEntradas.push(entrada);
        }
        return listaEntradas;
    }

    async consultar2(prod, lote, conexao) {
        let sql = `
            SELECT ie.*, e.data_entrada, f.idFuncionario, f.nome_funcionario 
            FROM itensEntrada ie 
            JOIN entrada e ON ie.ent_id = e.entrada_id 
            JOIN funcionarios f ON e.entrada_funcionario_id = f.idFuncionario 
            WHERE ie.lote_cod = ? AND ie.prod_id = ?
        `;
        let parametros = [lote, prod];
    
        const [registros, campos] = await conexao.execute(sql, parametros);
        let listaItensEntradas = [];
    
        for (const registro of registros) {
            let funcionario = new Funcionario(registro.idFuncionario, registro.nome_funcionario);
            let entrada = new Entrada(registro.ent_id, funcionario, registro.data_entrada); // Incluímos o funcionário e a data de entrada
            let produto = new Produto(registro.prod_id);
    
            await produto.consultar(registro.prod_id).then((listaProd) => {
                produto = listaProd.pop();
            });
    
            let loteObj = new Lote(registro.lote_cod, null, null, produto);
    
            await loteObj.consultar().then((listaLote) => {
                loteObj = listaLote.pop();
            });
    
            let itensEntrada = new ItensEntrada(entrada, loteObj, produto, registro.qtde);
            listaItensEntradas.push(itensEntrada);
        }
    
        return listaItensEntradas;
    }
    
    
    async consultarTotal(termo,dataInicio, dataFim, conexao, ) {
        let sql = "SELECT COUNT(e.entrada_id) AS total FROM entrada e";
        let parametros = [];
    
        if (!isNaN(parseInt(termo))) {
            sql += ' JOIN funcionarios f ON e.entrada_funcionario_id = f.idFuncionario WHERE f.idFuncionario = ?';
            parametros = [termo];
    
            // Adiciona a condição de tempo
            if (dataInicio && dataFim) {
                sql += ' AND e.data_entrada BETWEEN ? AND ?';
                parametros.push(dataInicio, dataFim);
            }
        } else {
            // Se o termo não é um número válido, retorne 0
            return 0;
        }
    
        const [registros, campos] = await conexao.execute(sql, parametros);
        let total = registros[0].total; // Acessa o valor da contagem retornada
        return total;
    }
    

    async consultarTotalItens(termo, dataInicio, dataFim, conexao) {
        let sql = '';
        let parametros = [];
    
        if (!isNaN(parseInt(termo))) {
            sql += `SELECT e.entrada_funcionario_id, COUNT(ie.ent_id) AS total
                FROM entrada e
                JOIN itensEntrada ie ON e.entrada_id = ie.ent_id
                WHERE e.entrada_funcionario_id = ?`;
            parametros = [termo];
    
            // Adiciona a condição de tempo
            if (dataInicio && dataFim) {
                sql += ' AND e.data_entrada BETWEEN ? AND ?';
                parametros.push(dataInicio, dataFim);
            }
    
            sql += ' GROUP BY e.entrada_funcionario_id;';
        } else {
            // Se o termo não é um número válido, retorne 0
            return 0;
        }
    
        const [registros, campos] = await conexao.execute(sql, parametros);
        let total = registros.length > 0 ? registros[0].total : 0; // Acessa o valor da contagem retornada
        return total;
    }
    

    async consultarUltima(termo, dataInicio, dataFim, conexao) {
        let sql = '';
        let parametros = [];
    
        if (!isNaN(parseInt(termo))) {
            sql += `SELECT *
                FROM entrada
                WHERE entrada_funcionario_id = ?`;
    
            parametros = [termo];
    
            // Adiciona a condição de tempo
            if (dataInicio && dataFim) {
                sql += ' AND data_entrada BETWEEN ? AND ?';
                parametros.push(dataInicio, dataFim);
            }
    
            sql += ' ORDER BY data_entrada DESC, entrada_id DESC LIMIT 1;';
        } else {
            // Se o termo não é um número válido, retorne null
            return null;
        }
    
        const [registros, campos] = await conexao.execute(sql, parametros);
        let registro = registros.pop();
        let funcionario = new Funcionario();
        await funcionario.consultar(registro.entrada_funcionario_id).then((listaFunc)=>{
            funcionario = listaFunc.pop();
        });
        let entrada = new Entrada(registro.entrada_id, funcionario,registro.data_entrada,[]);
        let lista_ItensEntradas = [];
        let itensEntrada = new ItensEntrada(entrada);
        await itensEntrada.consultar(conexao).then((listaItensEntradas)=>{
            lista_ItensEntradas = listaItensEntradas;
        });
        entrada.itensEntrada = lista_ItensEntradas;
        return entrada;
    }

    async consultarNovosLotes(idFun,inicio, fim, conexao) {
        let sql = `
            SELECT l.codigo,l.produto_prod_ID FROM lote l, entrada e, itensentrada i
            WHERE l.data_entrada = e.data_entrada AND 
            e.entrada_id = i.ent_id AND i.lote_cod = l.codigo AND
            e.entrada_funcionario_id = ?  AND e.data_entrada BETWEEN ? AND ? GROUP BY l.codigo,l.produto_prod_ID;
        `;
        let parametros = [idFun,inicio, fim];
        const [registros, campos] = await conexao.execute(sql, parametros);
        let listaLotes = [];
        
        for (const registro of registros) {
            let produto = new Produto(registro.produto_prod_ID);
            await produto.consultar(registro.produto_prod_ID).then((listaProd)=>{
                produto = listaProd.pop();
            });
            let lote = new Lote(registro.codigo, null, null, produto);
            await lote.consultar().then((listaLote)=>{
                lote= listaLote.pop();
            });
            
            listaLotes.push(lote);
        }
        return listaLotes;
    }
    
}