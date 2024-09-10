const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Conectar con MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Brand1739',
    database: 'mads'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

// Endpoint para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Campos incompletos' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            const user = results[0];

            if (user.password === password) {
                return res.json({ success: true, message: 'Inicio de sesión exitoso' });
            } else {
                return res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            return res.json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

// Endpoint para iniciar la jornada
app.post('/api/jornada/iniciar', (req, res) => {
    const { user_id, start_time } = req.body;

    if (!user_id || !start_time) {
        return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const query = 'INSERT INTO jornadas (user_id, start_time) VALUES (?, ?)';

    db.query(query, [user_id, start_time], (err, results) => {
        if (err) {
            console.error('Error al registrar el inicio de la jornada:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        return res.json({ success: true, message: 'Jornada iniciada correctamente' });
    });
});

// Endpoint para terminar la jornada
app.post('/api/jornada/terminar', (req, res) => {
    const { user_id, end_time } = req.body;

    if (!user_id || !end_time) {
        return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const query = 'UPDATE jornadas SET end_time = ? WHERE user_id = ? AND end_time IS NULL';

    db.query(query, [end_time, user_id], (err, results) => {
        if (err) {
            console.error('Error al finalizar la jornada:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        return res.json({ success: true, message: 'Jornada finalizada correctamente' });
    });
});
