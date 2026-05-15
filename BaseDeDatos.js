//Importar el paquete mysql2 (versión que usa promesas, más fácil)
const mysql = require('mysql2/promise');

//Datos de conexión (los que ya tenías de Aiven)
const config = {
  host: 'mysql-2a58e4cb-tec67.h.aivencloud.com',
  port: 12053,
  user: 'avnadmin',
  password: 'AVNS_ti2q5w8Kl0NOFrrT0xi',
  database: 'defaultdb'
};

//Función principal que hará todo
async function main() {
  let connection;

  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection(config);
    console.log('Conectado a la BD de Kueski Pay');

    // Crear tabla de donantes
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS donantes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100),
        email VARCHAR(100),
        monto DECIMAL(10,2),
        fecha DATE
      )
    `);
    console.log('Tabla "donantes" lista');

    // Crear tablas (si no existen)
    // Tabla de comercios afiliados (páginas donde aceptan Kueski Pay)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comercios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        dominio VARCHAR(100) NOT NULL UNIQUE,
        activo BOOLEAN DEFAULT true
      )
    `);
    console.log('Tabla "comercios" lista');

    // Tabla de usuarios (clientes con su saldo)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) UNIQUE NOT NULL,
        nombre VARCHAR(100),
        saldo DECIMAL(10,2) DEFAULT 0.00
      )
    `);
    console.log('Tabla "usuarios" lista');

    // Tabla para registrar cada vez que el usuario visita una página afiliada
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS visitas (
        id INT PRIMARY KEY AUTO_INCREMENT,
        usuario_id INT,
        comercio_id INT,
        url VARCHAR(300),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla "visitas" lista');

    // Agregar algunos comercios afiliados (si no existen)
    await connection.execute(`
      INSERT IGNORE INTO comercios (nombre, dominio) VALUES
      ('Mercado Libre', 'mercadolibre.com'),
      ('Amazon', 'amazon.com.mx'),
      ('Liverpool', 'liverpool.com.mx')
    `);
    console.log('Comercios de ejemplo insertados');

    // Crear un usuario de prueba (con saldo inicial de $500)
    await connection.execute(`
      INSERT IGNORE INTO usuarios (email, nombre, saldo) VALUES
      ('cliente@kueski.com', 'Juan Pérez', 500.00)
    `);
    console.log('Usuario de prueba creado (saldo $500)');

    // Ejemplo de uso: detectar si un dominio está afiliado
    const dominioABuscar = 'mercadolibre.com';
    const [comercio] = await connection.execute(
      'SELECT * FROM comercios WHERE dominio = ? AND activo = true',
      [dominioABuscar]
    );

    if (comercio.length > 0) {
      console.log(`\n¡SÍ! "${dominioABuscar}" está afiliado a Kueski Pay`);
      console.log(`   Comercio: ${comercio[0].nombre}`);

      // Registrar la visita (para saber qué páginas ve el usuario)
      const usuarioId = 1; // El usuario que creamos tiene id = 1
      const urlVisitada = 'https://mercadolibre.com/producto-ejemplo';
      await connection.execute(
        'INSERT INTO visitas (usuario_id, comercio_id, url) VALUES (?, ?, ?)',
        [usuarioId, comercio[0].id, urlVisitada]
      );
      console.log('Visita registrada correctamente');
    } else {
      console.log(`"${dominioABuscar}" NO está afiliado a Kueski Pay`);
    }

    // Mostrar todo lo que tenemos en las tablas
    console.log('\nLista de comercios afiliados');
    const [comercios] = await connection.execute('SELECT * FROM comercios');
    console.table(comercios);

    console.log('\nUsuarios registrados');
    const [usuarios] = await connection.execute('SELECT * FROM usuarios');
    console.table(usuarios);

    console.log('\nÚltimas visitas registradas');
    const [visitas] = await connection.execute('SELECT * FROM visitas');
    console.table(visitas);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) await connection.end();
    console.log('Conexión cerrada');
  }
}

// Ejecutar todo
main();