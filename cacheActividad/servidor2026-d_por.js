const express = require('express');
const mysql = require('mysql2');
const NodeCache = require('node-cache');
const path = require('path');

const myCache = new NodeCache({ stdTTL: 2026 }); // duración de 2026 segundos

const app = express();

const connection = mysql.createConnection({
  host: 'mysql-2a58e4cb-tec67.h.aivencloud.com',
  port: 12053,
  user: 'avnadmin',
  password: 'AVNS_ti2q5w8Kl0NOFrrT0xi',
  database: 'defaultdb'
});

let datosDB;

function getDonantes() {
  const cacheKey = "misDonantes";
  const consultaSQL = `SELECT * FROM donantes;`;

  const cachedDonantes = myCache.get(cacheKey);
  if (cachedDonantes) {
    console.log("Servido desde el caché");
    return cachedDonantes;
  }

  console.log("Consultando base de datos");

  connection.connect(error => {
    if (error) throw error;
    console.log("Conectada");
  });

  connection.query(consultaSQL, (error, resultados) => {
    if (error) throw error;
    console.log(resultados);
    myCache.set(cacheKey, resultados);
    datosDB = resultados;
    // connection.end();
  });

  console.log(datosDB);
  return datosDB;
}

app.get('/storage', (req, res) => {
  res.sendFile(path.join(__dirname, 'localStorage_por.html'));
});

app.get('/obtenerDatos', (req, res) => {
  const datos = getDonantes();
  res.json(datos);
});

app.listen(1984, () => {
  console.log('Up and up');
});