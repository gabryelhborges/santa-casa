import mysql from "mysql2/promise";
class DB {
    static pool = null;
    static async conectar() {
        if (DB.pool) {
            return DB.pool; // Retorna uma conexão do pool existente
        } else {
            let novaPool = mysql.createPool({
                host: 'localhost',
                port: '3306',
                user: 'root',
                password: '',
                database: 'santa_casa',
                waitForConnections: true, // Espera por conexões livres
                connectionLimit: 10, // Limite máximo de conexões no pool
                maxIdle: 10, // Máximo de conexões inativas
                idleTimeout: 60000, // Tempo limite das conexões inativas em milissegundos
                queueLimit: 0, // Limite de filas de conexões
                enableKeepAlive: true, // Habilita a manutenção de conexão ativa
                keepAliveInitialDelay: 0 // Tempo inicial para manutenção de conexão ativa
            });
            DB.pool= await novaPool.getConnection();
            return DB.pool; // Retorna uma conexão do novo pool
        }
    }
}

export default DB;