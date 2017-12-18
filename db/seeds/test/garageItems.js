exports.seed = function(knex, Promise) {
  return knex('garageItems').del()
    .then(() => {
      return Promise.all([
        knex('garageItems').insert({
          id: 1,
          name: 'snowglobe',
          reason: 'christmas gift from 1987',
          cleanliness: 'dusty'
        }, 'id')
      ])
      .then(() => console.log('DEV seeding complete!'))
      .catch((error) => console.log({ error }));
    })
    .catch((error) => console.log({ error }));
};
