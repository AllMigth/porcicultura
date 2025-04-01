const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('/mnt/disk/blog.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  )
`);

// Ruta para obtener todas las entradas
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Ruta para agregar una nueva entrada
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Título y contenido son requeridos' });
    return;
  }

  db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, title, content });
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Cerrar la base de datos al apagar el servidor (opcional)
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('Error al cerrar la base de datos:', err.message);
    console.log('Base de datos cerrada');
    process.exit(0);
  });
});

const compression = require('compression');
app.use(compression());