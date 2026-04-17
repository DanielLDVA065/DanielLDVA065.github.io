import http from 'http';

const API_KEY = 'a65779a507a9d7d7f2094602e37759f5';

const servidor = http.createServer((req, res) => {
  console.log('Alguien me mandó una solicitud');

  if (req.method === 'GET') {
    manejarGET(res);
    return;
  }

  if (req.method === 'POST') {
    manejarPOST(req, res);
    return;
  }

  res.writeHead(404);
  res.end('Ruta no encontrada');
});


// GET
async function manejarGET(res) {
  try {
    const musicResponse = await fetch('https://www.theaudiodb.com/api/v1/json/123/search.php?s=slipknot');
    const musicData = await musicResponse.json();

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Guadalajara&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    // Validacion
    const artista = musicData?.artists?.[0]?.strArtist || 'No disponible';
    const bio = musicData?.artists?.[0]?.strBiographyEN || 'Sin biografía';
    const img = musicData?.artists?.[0]?.strArtistThumb || '';

    const temp = weatherData?.main?.temp ?? 'N/A';
    const clima = weatherData?.weather?.[0]?.description ?? 'No disponible';

    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.end(`
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
    `);

  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error al obtener datos');
    }
  }
}


// POST
function manejarPOST(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const nombre = body.split('=')[1] || 'Usuario';

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Hola ${nombre}</h1>
      <p>Datos recibidos correctamente</p>
      <a href="/">Volver</a>
    `);
  });
}


servidor.listen(2026, () => {
  console.log('Servidor en http://localhost:2026');
});