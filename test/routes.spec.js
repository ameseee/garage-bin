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

describe('API Routes', () => {

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
        chai.request(server)
          .get('/api/v1/garageItems')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(1);
            response.body.includes({ "id": 1 });
            response.body.includes({ "name": "snowglobe" });
            response.body.includes({ "reason": "christmas gift from 1987" });
            response.body.includes({ "cleanliness": "dusty" });
          });
      });

      it('should return a 404 if the path is incorrect', (done) => {
        chai.request(server)
          .get('/api/v1/sadness')
          .end((error, response) => {
            response.should.have.status(404);
            done();
          });
      });

    });

    describe('POST /api/v1/garageItems', () => {
      it('should be able to add an item to the garage database', (done) => {
        chai.request(server)
          .post('/api/v1/garageItems')
          .send({
            id: 3,
            name: "Toilet paper",
            reason: "Grandpa hoarded it",
            cleanliness: "sparkling"
          })
          .end((error, response) => {
            response.should.have.status(201);
            response.body.should.have.property('id');
            response.body.id.should.equal(3);
            chai.request(server)
              .get('/api/v1/garageItems')
              .end((error, response) => {
                response.body.should.be.a('array');
                response.body.length.should.equal(2);
                done();
              });
          });
      });

      it('should not create a project with missing data', (done) => {
        chai.request(server)
          .post('/api/v1/garageItems')
          .send({
            id: 3,
            name: "Toilet paper",
            reason: "Grandpa hoarded it"
          })
          .end((error, response) => {
            response.should.have.status(422);
            done();
          });
      });

    });

    describe('GET /api/v1/garageItems/:id', () => {
      it('should retrieve a specific garage item', (done) => {
        chai.request(server)
          .get('/api/v1/garageItems/1')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(1);
            response.body.includes({ 'id': 1 });
            response.body.includes({ 'name': "snowglobe" });
            response.body.includes({ 'reason': "christmas gift from 1987" });
            response.body.includes({ 'cleanliness': "dusty" });
            done();
          })
      });

      it('should return a 404 if path does not exist', (done) => {
        chai.request(server)
          .get('/api/v1/sadness')
          .end((error, response) => {
            response.should.have.status(404);
            done();
          })
      });

    });

    // describe('PATCH /api/v1/garageItems/:id', () => {
    //   it('should be able to update the body of a garage item', (done) => {
    //
    //   });
    //
    //   it('shoul return a 404 if a garage item body is not provided', (done) => {
    //
    //   });
    //
    // });

});
