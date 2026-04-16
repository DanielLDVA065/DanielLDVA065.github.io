import http from 'http';

const servidor = http.createServer(async (req, res) => {
  console.log('Alguien me mandó una solicitud');

  try {
    const response = await fetch('https://www.theaudiodb.com/api/v1/json/123/search.php?s=slipknot');
    const data = await response.json();

    res.writeHead(200, { 'Content-Type': 'text/html' });

    // HTML
    res.end(`
      <h1>${data.artists[0].strArtist}</h1>
      <p>${data.artists[0].strBiographyEN}</p>
      <img src="${data.artists[0].strArtistThumb}" width="300">
    `);

  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error al obtener datos');
  }
});

const puerto = 2026;

servidor.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});