const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const requireHTTPS = (request, response, next) => {
  if (request.header('x-forwarded-proto') !== 'https') {
    return response.redirect(`https://${request.header('host')}${request.url}`);
  }
  next();
};
if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Garage Bin';

app.get('/api/v1/garageItems', (request, response) => {
  database('garageItems').select()
    .then((garageItems) => {
      return response.status(200).json(garageItems);
    })
    .catch((error) => {
      response.status(500).json({ error })
    });
});

app.post('/api/v1/garageItems', (request, response) => {
  const garageItem = request.body;

  for (let requiredParameter of ['name', 'reason', 'cleanliness']) {
    if (!garageItem[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }

  database('garageItems').insert(garageItem, 'id')
    .then(garageItemId => {
      return response.status(201).json({ id: garageItemId[0] });
    })
    .catch((error) => response.status(500).json({ error }));
});

app.get('/api/v1/garageItems/:id', (request, response) => {
  const { id } = request.params;
  console.log(id);

  database('garageItems').where('id', id).select()
    .then((garageItem) => {
      return response.status(200).json(garageItem);
    })
    .catch((error) => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
