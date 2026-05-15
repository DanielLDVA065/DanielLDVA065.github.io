// servidor_bancos_simple.js
const express = require('express');
const app = express();
app.use(express.json());

// Datos en memoria (simplificados)
const usuarios = {
  1: [{ id: 1, nombre: 'BBVA', cuenta: '123' }],
  2: [{ id: 2, nombre: 'Santander', cuenta: '456' }]
};

// Obtener bancos de un usuario
app.get('/getBancos/:userId', (req, res) => {
  const bancos = usuarios[req.params.userId] || [];
  res.json(bancos);
});

// Agregar banco a un usuario
app.post('/postBancos/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!usuarios[userId]) usuarios[userId] = [];
  const nuevo = { id: Date.now(), ...req.body };
  usuarios[userId].push(nuevo);
  res.status(201).json(nuevo);
});

// Obtener un banco específico
app.get('/getBanco/:userId/:bancoId', (req, res) => {
  const bancos = usuarios[req.params.userId] || [];
  const banco = bancos.find(b => b.id == req.params.bancoId);
  banco ? res.json(banco) : res.status(404).json({ error: 'No existe' });
});

// Eliminar banco
app.delete('/deleteBanco/:userId/:bancoId', (req, res) => {
  const bancos = usuarios[req.params.userId];
  if (bancos) {
    const index = bancos.findIndex(b => b.id == req.params.bancoId);
    if (index !== -1) {
      const eliminado = bancos.splice(index, 1);
      return res.json(eliminado[0]);
    }
  }
  res.status(404).json({ error: 'No encontrado' });
});

app.listen(3000, () => console.log('Servicio de bancos listo'));