const knex = require('./db');

exports.addRecord = async (req, res) => {
  const currDate = new Date();
  knex('records')
    .insert({
      'date': `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`,
      'indexes': JSON.stringify(req.body.indexes),
    })
    .then(() => {
      res.json({
        date: req.body.date,
        indexes: req.body.indexes
      });
    })
    .catch(err => {
      res.json({ message: `There was an error creating selection: ${err}` });
    });
};

exports.findRecord = async (req, res) => {
  const currDate = new Date();
  
  knex('records')
    .where('date', `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`)
    .then(record => {
      res.json(record);
    })
    .catch(err => {
      res.json('');
    });
};

exports.deleteRedord = async (req, res) => {
  knex('records')
    .where('id', req.params.id)
    .delete()
    .catch(err => {
      res.json({ message: `There was an error such records: ${err}` });
    });
};

exports.getAll = async (req, res) => {
  knex
    .select('*')
    .from('records')
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ message: `There was an error retrieving books: ${err}` });
    });
};