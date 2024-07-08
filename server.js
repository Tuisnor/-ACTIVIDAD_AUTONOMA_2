const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json({ type: 'application/json' }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_curso_app'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

app.post("/insertar", function (req, res) {
    const { cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion } = req.body;
    connection.query(
        'INSERT INTO persona (cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)',
        [cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion],
        function (error, results) {
            if (error) throw error;
            res.json({ persona: results });
        }
    );
});

app.post("/seleccionar", function (req, res) {
    connection.query('SELECT * FROM persona', function (error, results) {
        if (error) throw error;
        res.json({ personas: results });
    });
});

app.post("/seleccionarPorId", function (req, res) {
    const { idpersona } = req.body;
    connection.query('SELECT * FROM persona WHERE idpersona = ?', [idpersona], function (error, results) {
        if (error) throw error;
        if (results.length > 0) {
            res.json({ persona: results[0] });
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    });
});

app.post("/actualizar", function (req, res) {
    const { idpersona, cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion } = req.body;
    connection.query(
        'UPDATE persona SET cedula = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, telefono = ?, direccion = ? WHERE idpersona = ?',
        [cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion, idpersona],
        function (error, results) {
            if (error) throw error;
            if (results.affectedRows > 0) {
                res.json({ persona: { idpersona, cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion } });
            } else {
                res.status(404).json({ error: 'Persona no encontrada' });
            }
        }
    );
});

app.post("/eliminar", function (req, res) {
    const { idpersona } = req.body;
    connection.query('DELETE FROM persona WHERE idpersona = ?', [idpersona], function (error, results) {
        if (error) throw error;
        if (results.affectedRows > 0) {
            res.json({ mensaje: 'Persona eliminada' });
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    });
});

app.listen(3001);
console.log("Servidor iniciado en el puerto: " + 3001);