import express from 'express';
import mysql from 'mysql2';
//Pendiente nombre de la librería
import Node from 'node-';

import path from 'path';
import { fileURLToPath } from 'url';


//stdTTL
const myCache = new NodeCache({ stdTTL:  });

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const app = express();


//Completa los datos correctos
const connection = mysql.createConnection({
  host: ".aivencloud.com",
  port: 20902,
  user: "",
  password: "",
  database: "defaultdb"
});


let datosDB;

function getDonantes() {

  //Pon un nombre a la llave
  const cacheKey = "";

  //Si es necesario cambia la consulta
  const consultaSQL = `SELECT * FROM donantes;`;

  //Completa el dato faltante
  const cachedDonantes = myCache.get();

  if (cachedDonantes) {
    console.log("Servido desde el caché");

    //falta el dato a regresar
    return ;
  }

  console.log("Consultando base de datos");


  //Esto lo vimos ayer
  connection.connect(error => {
    if (error) throw error;
    console.log("Conectada");
  });


  connection.query(consultaSQL, (error, resultados) => {
    if (error) throw error;

    console.log(resultados);
    //Faltan datos
    myCache.set(, );
    datosDB = resultados;
    //connection.end();

  });

  console.log(datosDB);
  return datosDB;
}

app.get('/storage', (req, res) => {

  //Falta un dato
  res.sendFile(path.join(__dirname, ''));
});

app.get('/obtenerDatos', (req, res) => {

  //Falta llamar una función
  const datos = 

  res.json(datos);
});

app.listen(1984, () => {
  console.log('Up and up');
});
