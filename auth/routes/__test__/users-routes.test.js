const request = require('supertest');
const app = require('../../index');

it('should send a post request to sign up and get a response', async()=>{
    return request(app)
           .post('/api/users/sign-up')
           .send({
               email: 'test@mail.com',
               password: 'password'
           })
           .expect(201);
}) 