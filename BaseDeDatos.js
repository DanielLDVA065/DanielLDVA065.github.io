const mysql = require('mysql2/promise');

const config = {
  host: 'mysql-31efc894-tec-f26e.e.aivencloud.com',
  port: 20902,
  user: 'avnadmin',
  password: 'AVNS_GJwkU29Bq2KswwA_MOt',
  database: 'defaultdb'
};

async function main() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Conectado a la base de datos');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS donantes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(255) NOT NULL
      )
    `);
    console.log('Tabla "donantes" verificada/creada');

    const [result] = await connection.execute(`
      INSERT INTO donantes (nombre)
      SELECT 'Donante Anónimo'
      WHERE NOT EXISTS (SELECT 1 FROM donantes WHERE nombre = 'Donante Anónimo')
    `);
    if (result.affectedRows > 0) {
      console.log('Donante insertado');
    } else {
      console.log('El donante ya existe, no se insertó duplicado');
    }

    const [rows] = await connection.execute('SELECT * FROM donantes');
    console.log('\nLista de donantes:');
    console.table(rows);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada');
    }
  }
}

main();