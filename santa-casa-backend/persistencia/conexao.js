import mysql from "mysql2/promise";
export default async function conectar(){
    if (global.poolConexoes) {
        return await global.poolConexoes.getConnection();//Código tratado como sincrono, será tratado na camada de controle
    }
    else {
        const pool = mysql.createPool({
            host: 'localhost',//localhost
            port: '3306',
            user: 'root',
            password: '',
            database: 'santa_casa',
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 2, // Máximo de conexões inativas; o valor padrão é o mesmo que "connectionLimit"
            idleTimeout: 60000, // Tempo limite das conexões inativas em milissegundos; o valor padrão é "60000"
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });
        global.poolConexoes = pool;
        return await pool.getConnection();
    }
}