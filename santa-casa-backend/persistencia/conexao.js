import mysql from "mysql2/promise";
export default async function conectar(){
    if (global.poolConexoes) {
        return await global.poolConexoes.getConnection();//Código tratado como sincrono, será tratado na camada de controle
    }
    else {
        const pool = mysql.createPool({
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '1234',
            database: 'santa_casa',
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // Máximo de conexões inativas; o valor padrão é o mesmo que "connectionLimit"
            idleTimeout: 60000, // Tempo limite das conexões inativas em milissegundos; o valor padrão é "60000"
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });
        global.poolConexoes = pool;
        return await pool.getConnection();
    }
}