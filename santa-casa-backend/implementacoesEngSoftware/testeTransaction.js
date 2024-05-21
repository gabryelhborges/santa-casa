import DB from "../persistencia/db.js";

async function executarTransacao() {
    var connection = await DB.conectar();
    try {
        // Inicia a transação
        await connection.beginTransaction();

        connection = await DB.conectar();
        connection = await DB.conectar();

        let novaConexao = await DB.conectar();

        if(connection === novaConexao){
            console.log("Mesma conexão!");
        }

        // Executa suas consultas SQL dentro da transação
        await connection.execute(`INSERT INTO itensConsumo(ic_cons_id, ic_lote_codigo, ic_prod_id, ic_qtdeConteudoUtilizado) VALUES(?,?,?,?)`, [2, 54321, 2, 33]);
        await connection.execute(`INSERT INTO itensConsumo(ic_cons_id, ic_lote_codigo, ic_prod_id, ic_qtdeConteudoUtilizado) VALUES(?,?,?,?)`, [200, 12345, 1, 22]);//Erro, não existe consumo 200, fazer rollback
        // Confirma a transação
        await connection.commit();
        console.log('Transação concluída com sucesso!');
    } catch (err) {
        // Reverte a transação em caso de erro
        await connection.rollback();
        console.log('Transação falhou, fazendo rollback.', err);
    } finally {
        // Libera a conexão de volta ao pool
        connection.release();
    }
}


executarTransacao();