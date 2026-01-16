const request = require('supertest');
const app = require('../server'); // se exportares o app
describe('Autenticação JWT', () => {
 it('deve recusar login inválido', async () => {
 const res = await request(app).post('/login').send({ username: 'x', password: 'y' });
 expect(res.statusCode).toBe(401);
 });
});