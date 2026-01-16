const express = require('express');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const app = express();
app.use(express.json());
// Utilizador de exemplo
const user = { id: 1, username: 'admin', password: bcrypt.hashSync('12345', 8) };

// LOGIN - gera token JWT
app.post('/login', (req, res) => {
 const { username, password } = req.body;
 if (username !== user.username || !bcrypt.compareSync(password, user.password)) {
 return res.status(401).json({ message: 'Credenciais inválidas' });
 }
 const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, { expiresIn: '1h'
});
 res.json({ token });
});

// Middleware de autenticação
function verifyToken(req, res, next) {
 const header = req.headers['authorization'];
 const token = header && header.split(' ')[1];
 if (!token) return res.status(403).json({ message: 'Token ausente' });
 jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
 req.user = decoded;
 next();
 });
}

// Endpoint protegido
app.get('/tasks', verifyToken, (req, res) => {
 res.json([{ id: 1, title: 'Configurar CI/CD' }, { id: 2, title: 'Implementar JWT' }]);
});
module.exports = app;
