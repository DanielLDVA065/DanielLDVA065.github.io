//Escribe un comentario explicando para qué sirve http
//Sistema que permite que navegadores web puedan mandar y recibir elementos de HTML, videos, imagenes, etc. de servidores.
import http, { get } from 'http';
//Escribe un comentario explicando para qué sirve fs
//Files System sirve para interactuar con archivos del servidor en JavaScript.
import fs from 'fs';
import path from 'path';


    //Esta función deberá mostrar deberá mostrar una página HTML 
    //con la bienvenida a tu proyecto
    function darBienvenida(req, res) {
      //const filePath = path.join(__dirname, 'bienvenida.html');
      //res.sendFile(filePath);
       //Agrega lo mínimo necesario en bienvenida.html
       
      fs.readFile('bienvenida.html', 'utf8', (error, data) => {
        if (error) {
           //Escribe qué significa el 500 
           // 500 es el codigo para indicar un error interrno el servidor.
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Oh no!!!!');
          return;
        }
        //Escribe qué significa el 200
        //200 es el codigo que dice que toda la peticion salio correctamente.
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
    }


    //Esta función deberá enviar un json con los datos de los usuarios
    function getUsuarios(req, res) {
        //Esto representa un objeto JSON de un usuario
        //Agrega otro usuario
        const usuarios = [{
            "nombre": "Punk",
            "saldo": "0",
          },
          {
            "nombre": "Isaac",
            "saldo": "100000000",
          }];

      res.writeHead(200, { 'Content-Type': 'application/json' });
      
      //Escribe qué hace la función stringify y por qué la tenemos que usar
      //Stringify convierte un objeto de JavaScript en un string en JSON.
      res.end(JSON.stringify(usuarios));
    }

  
    function mostrarPerfil(req, res) {
        fs.readFile('perfil.html', 'utf8', (error, data) => {
            if (error) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Oh no!!!!');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
      }

     
      function mostrarMovimientos(req, res) {
        //Construye una página básica movimientos.html
        fs.readFile('movimientos.html', 'utf8', (error, data) => {
            if (error) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Oh no!!!!');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
      }

    //Esta función deberá enviar un json con los datos de las movimientos
    function getMovimientos(req, res) {
    //Tienes que corregir varias cosas en esta sección
    const movimientos = [
        { id:1, accion: "Compra", monto: 100, fecha: "24/4/2024" },
        { id:2, accion: "Venta", monto: 50, fecha: "25/4/2024" }
    ];
    const jsonString = JSON.stringify(movimientos);
    console.log(jsonString);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonString);
    }

    function manejarRuta404(req, res) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      //Cambia el mensaje por algo más divertido
      res.end('La princesa no esta en este castillo.');
    }

    function mostrarEquipo(req, res) {
        fs.readFile('equipo.html', 'utf8', (error, data) => {
            if (error) { 
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Oh no!!!!');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
      }

      function mostrarEstatus(req, res) {
        fs.readFile('estatus.html', 'utf8', (error, data) => {
            if (error) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Oh no!!!!');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
      }
    //incluye el enlace a la documentación de createServer
    //https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
    const servidor = http.createServer((req, res) => {
      const url = req.url;

      if (url === '/') {
        darBienvenida(req, res);
      } else if (url === '/api/usuarios') {
        getUsuarios(req, res);
      } else if (url === '/api/movimientos') {
        getMovimientos(req, res);
      } 
      else if (url === '/usuarios') {
        mostrarUsuarios(req, res);
      } 
      else if (url === '/movimientos') {
        mostrarMovimientos(req, res);
      } 
      //Agrega una ruta /equipo y su función correspondiente para que muestre el equipo del proyecto
      else if (url === '/equipo') {
        mostrarEquipo(req, res);
      }
      //Tarea 6 endpoints
      else if (url === '/Estatus') {
        mostrarEstatus(req, res);
      }
      //Haz una página equipo.html correspondiente
      //Escribe el nombre completo y una cualidad que valores en esa persona de tu equipo
      //Trata de agregar una imagen a equipo.html
      //Explica si la puedes ver, en caso negativo ¿qué crees que pase?
      //No la veo, yo creo que es porque no puede mostrar la imagen adecuadamente desde el html y se debe hacer un proceso distinto.
    
      //Agrega una ruta /opinion
      //Haz una página opinion.html
      // Lee el siguiente artículo y responde ¿Crees que el colonialismo digital es un riesgo para tu carrera profesional? ¿Para tu vida persona?
      //El colonialismo digital es un peligro para mi carrera profesional porque disminuye las chances de ser exitoso como un programador independiente. Para mi vida personal, tambien es un peligro, ya que mi privacidad se ve vulnerada. 
      //¿Qué es el freedombox?
      //Software gratis que convierte computadoras en servers personales sin ningun control externo.
      //https://www.aljazeera.com/opinions/2019/3/13/digital-colonialism-is-threatening-the-global-south
      else {
        manejarRuta404(req, res);
      }
    });

    const puerto = 1984;
    servidor.listen(puerto, () => {
      console.log(`Servidor escuchando en el puerto ${puerto}`);
    });

    //Importante
    //En esta actividad deberás agregar en miarchivo.html un enlace a servidor.js y al resto de los html
