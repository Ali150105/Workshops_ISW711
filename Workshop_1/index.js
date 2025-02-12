const express = require('express');
const app = express();

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Hola, mundo desde Node.js!');
});

// Puerto del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});