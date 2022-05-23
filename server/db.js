const path = require('path');

const dbPath = path.resolve(__dirname, './../database.sqlite');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true
});

knex.schema
  .hasTable('records')
    .then((exists) => {
      if (!exists) {
        return knex.schema.createTable('records', table => {
          table.increments('id').primary();
          table.date('date').unique();
          table.string('indexes');
        })
        .then(() => {
          console.log('Table \'Records\' created');
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`);
        });
      }
    })
    .then(() => {
      console.log('done');
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`);
    });

// Just for debugging purposes:
// Log all data in "books" table
knex.select('*').from('records')
  .then(data => console.log('data:', data))
  .catch(err => console.log(err));

// Export the database
module.exports = knex;