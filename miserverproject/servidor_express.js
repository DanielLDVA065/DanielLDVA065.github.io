
const express = require('express');
const app = express();
const API_KEY = 'a65779a507a9d7d7f2094602e37759f5';

// Middleware para leer formularios POST — en http nativo esto era manual y verboso
app.use(express.urlencoded({ extended: true }));

// GET principal: artista + clima
app.get('/', async (req, res) => {
  try {
    const musicResponse = await fetch('https://www.theaudiodb.com/api/v1/json/123/search.php?s=slipknot');
    const musicData = await musicResponse.json();

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Guadalajara&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    const artista = musicData?.artists?.[0]?.strArtist || 'No disponible';
    const bio = musicData?.artists?.[0]?.strBiographyEN || 'Sin biografía';
    const img = musicData?.artists?.[0]?.strArtistThumb || '';
    const temp = weatherData?.main?.temp ?? 'N/A';
    const clima = weatherData?.weather?.[0]?.description ?? 'No disponible';

    // res.send() detecta el tipo automáticamente — mucho más cómodo que res.writeHead + res.end
    res.send(`
      <h1>${artista}</h1>
      <p>${bio}</p>
      <img src="${img}" width="300">
      <hr>
      <h2>Clima en Guadalajara</h2>
      <p>Temperatura: ${temp} °C</p>
      <p>Clima: ${clima}</p>
      <hr>
      <form method="POST" action="/">
        <input type="text" name="nombre" placeholder="Tu nombre" required>
        <button type="submit">Enviar</button>
      </form>
      <hr>
      <a href="/arbol">Ver árbol de mi universidad</a>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener datos');
  }
});

// POST — Express ya parsea el body, no hay que acumular chunks manualmente
app.post('/', (req, res) => {
  const nombre = req.body.nombre || 'Usuario';
  res.send(`
    <h1>Hola ${nombre}</h1>
    <p>Datos recibidos correctamente</p>
    <a href="/">Volver</a>
  `);
});

// Ruta extra: árbol universitario
// Coloca la imagen como "arbol.jpg" en la misma carpeta o ajusta la ruta
app.get('/arbol', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Árbol universitario</title></head>
    <body>
      <h1>Árbol representativo de mi universidad</h1>
      <p><strong>Nombre científico:</strong> Fresno (Fraxinus uhdei)</p>
      <img src="/arbol.jpg" alt="Árbol universitario" width="400">
      <br><br>
      <a href="/">← Volver</a>
    </body>
    </html>
  `);
});

// Express sirve archivos estáticos desde la carpeta actual si se configura así:
app.use(express.static(__dirname)); // descomenta si tu arbol.jpg está aquí

app.listen(2026, () => {
  console.log('Servidor Express en http://localhost:2026');
});

// Opinión sobre Express:
// - El enrutamiento por método (app.get, app.post) es mucho más claro que un if/else manual.
// - express.urlencoded() reemplaza toda la lógica de acumulación de chunks del POST.
// - res.send() y res.status() son intuitivos y reducen código repetitivo.
// - Para proyectos pequeños o grandes, Express escala bien sin complicar lo simple.
