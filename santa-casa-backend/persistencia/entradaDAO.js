

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
            parametros = ['%'+termo+'%'];
        }
        
    }
}