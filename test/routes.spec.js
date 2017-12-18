/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return an html homepage with text', (done) => {
  chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.includes('Garage Bin');
      done();
    });
});

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
      .get('/sadness')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });

});

describe('API Routes'), () => {

    before((done) => {
      database.migrate.latest()
        .then(()=> done())
        .catch((error) => {
          throw error;
        });
    });

    beforeEach((done) => {
      database.seed.run()
        .then(() => done())
        .catch((error) => {
          throw error;
        });
    });

    describe('GET /api/v1/garageItems', () => {
      it('should retrieve all of the garage items', () => {

      });

      it('should return a 404 if the path is incorrect', (done) => {

      });

    });

    describe('POST /api/v1/garageItems', () => {
      it('should be able to add an item to the garage database', (done) => {

      });

      it('should not create a project with missing data', (done) => {

      });

    });

    describe('GET /api/v1/garageItems/:id', () => {
      it('should retrieve a specific garage item', (done) => {

      });

      it('should return a 404 if path does not exist', (done) => {

      });

    });

    describe('PATCH /api/v1/garageItems/:id', () => {
      it('should be able to update the body of a garage item', (done) => {

      });

      it('shoul return a 404 if a garage item body is not provided', (done) => {

      });

    });
}
