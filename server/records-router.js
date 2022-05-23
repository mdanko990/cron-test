const express = require('express');

const recordsRouter = require('./records-controller.js');

const router = express.Router();

router.get('/find', recordsRouter.findRecord);
router.post('/add', recordsRouter.addRecord);
router.delete('/delete/:id', recordsRouter.deleteRedord);
router.get('/', recordsRouter.getAll);
module.exports = router;