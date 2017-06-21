const { expect } = require('chai');
const request = require('supertest');

require('dotenv').config();

const app = require('../app');

let token = '';

describe('meetup.events', () => {
  it('should login', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        password: process.env.ADMIN_PASSWORD
      })
      .expect(200)
      .then((response) => {
        token = response.body.token;
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should create a new event', (done) => {
    request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '(Denver) Java Study Group',
        description: '<p><span>Come on everyone, let\'s work and learn!!</span> <br></p>',
        image: 'https://secure.meetupstatic.com/photos/event/b/6/b/4/global_431686772.jpeg',
        date: '2017-06-20',
        start_time: '2017-06-20 18:00',
        end_time: '2017-06-20 20:00',
        url: 'https://www.meetup.com/Women-Who-Code-Boulder-Denver/events/237855725/',
        address: '1062 Delaware Street, Denver, CO',
        location_name: 'Galvanize'
      })
      .expect(200)
      .then(() => {
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should get events', (done) => {
    request(app)
      .get('/api/v1/events')
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.an('array');
        expect(response.body[0]).to.deep.include({
          title: '(Denver) Java Study Group',
          description: '<p><span>Come on everyone, let\'s work and learn!!</span> <br></p>',
          image: 'https://secure.meetupstatic.com/photos/event/b/6/b/4/global_431686772.jpeg',
          date: '2017-06-20T06:00:00.000Z',
          start_time: '2017-06-21T00:00:00.000Z',
          end_time: '2017-06-21T02:00:00.000Z',
          url: 'https://www.meetup.com/Women-Who-Code-Boulder-Denver/events/237855725/',
          address: '1062 Delaware Street, Denver, CO',
          location_name: 'Galvanize'
        });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});
