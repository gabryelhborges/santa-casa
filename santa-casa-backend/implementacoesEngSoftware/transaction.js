const mysql = require('mysql');

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'sua_base_de_dados'
});

// Conectando ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados.');
});

// Exemplo de transação
connection.beginTransaction((err) => {
  if (err) {
    throw err;
  }

  const consumo = { /* dados do consumo */ };
  const itensConsumidos = [/* lista de itens consumidos */];

  // Inserindo o consumo
  connection.query('INSERT INTO consumos SET ?', consumo, (err, result) => {
    if (err) {
      connection.rollback(() => {
        throw err;
      });
    }

    const consumoId = result.insertId;

    // Inserindo os itens consumidos
    const insercoes = itensConsumidos.map((item) => {
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO itens_consumidos SET ?', { ...item, consumo_id: consumoId }, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              reject(err);
            });
          }
          resolve();
        });
      });
    });

    Promise.all(insercoes)
      .then(() => {
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              throw err;
            });
          }
          console.log('Transação realizada com sucesso.');
          connection.end();
        });
      })
      .catch((err) => {
        connection.rollback(() => {
          throw err;
        });
      });
  });
});