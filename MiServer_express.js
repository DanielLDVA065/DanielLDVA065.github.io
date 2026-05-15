// servidor_express.js - Versión CommonJS (sin import)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname no existe en ES Modules, hay que reconstruirlo:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 2026;
const API_KEY = 'a65779a507a9d7d7f2094602e37759f5';

// Middleware para formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal (artista + clima)
app.get('/', async (req, res) => {
  try {
    const musicResponse = await fetch('https://www.theaudiodb.com/api/v1/json/123/search.php?s=slipknot');
    const musicData = await musicResponse.json();

    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Guadalajara&appid=${API_KEY}&units=metric`);
    const weatherData = await weatherResponse.json();

    const artista = musicData?.artists?.[0]?.strArtist || 'No disponible';
    const bio = musicData?.artists?.[0]?.strBiographyEN || 'Sin biografía';
    const img = musicData?.artists?.[0]?.strArtistThumb || '';
    const temp = weatherData?.main?.temp ?? 'N/A';
    const clima = weatherData?.weather?.[0]?.description ?? 'No disponible';

    res.send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Express + APIs</title></head>
      <body>
        <h1>${artista}</h1>
        <p>${bio}</p>
        <img src="${img}" width="300">
        <hr>
        <h2>Clima en Guadalajara</h2>
        <p>Temperatura: ${temp} °C</p>
        <p>Clima: ${clima}</p>
        <hr>
        <form method="POST">
          <input type="text" name="nombre" placeholder="Tu nombre" required>
          <button type="submit">Enviar</button>
        </form>
        <hr>
        <a href="/arbol">Ver el árbol de mi universidad</a>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener datos de las APIs');
  }
});

// Ruta POST
app.post('/', (req, res) => {
  const nombre = req.body.nombre || 'Usuario';
  res.send(`
    <h1>Hola ${nombre}</h1>
    <p>Datos recibidos correctamente</p>
    <a href="/">Volver</a>
  `);
});

// Ruta del árbol
app.get('/arbol', (req, res) => {
  const imagenUniversidad = "/arbol.jpg";  // Cambia por tu foto (debe estar en public/arbol.jpg)
  const nombreCientifico = "Taxodium mucronatum (Ahuehuete)";
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Árbol de mi universidad</title></head>
    <body>
      <h1>Árbol representativo de mi universidad</h1>
      <p><strong>Nombre científico:</strong> ${nombreCientifico}</p>
      <img src="${imagenUniversidad}" alt="Foto del árbol" style="max-width: 100%; height: auto;">
      <br><br>
      <a href="/">← Volver</a>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});

// Opinión sobre Express:
// - Código más limpio y legible que http nativo.
// - Enrutamiento simple y potente.
// - Middlewares integrados que evitan trabajo manual.
// - Gestión de errores más clara.
// - Ideal para APIs y aplicaciones web.