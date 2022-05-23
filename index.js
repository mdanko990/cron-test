const cron = require('node-cron');
const axios = require('axios');
const N_PERSONS = 5;

const findRecord = async () => {
  try {
    let res = await axios.get('http://localhost:4001/records/find');
    return await res.data;
  } catch (error) {
      console.log(error);
  }
};

const getRandomIndex = (arr, max) => {
  const index = Math.floor(Math.random() * max);
  if (!arr.includes(index)) {
    return index;
  } else {
    return getRandomIndex(arr, max);
  }
};

//This is temporary desicion.
//In future, we'll get indexes from google sheets, that includes selected sets of persons(ids)

const getIndexes = async () => {
  return await axios.get('https://api.pantheon.world/person?hpi=gt.80')
  .then(res => res.data)
  .then(data => {
    let result = [];
    let indexes = [];
    while(result.length < N_PERSONS){
      const index = getRandomIndex(indexes, data.length - 1);
      indexes.push(index);
      result.push(data[index].wp_id);
    }
    return result;
  });
};


const createRecord = async () => {
  try {
    const indexes = await getIndexes();
    console.log(indexes);
    let res = await axios.post('http://localhost:4001/records/add', {
      "indexes": indexes
    });
    return await res.data;
  } catch (error) {
      console.log(error);
  }
};

const renderPersons = async () => {
  let indexes;
  try{
    const foundRecord = await findRecord();    
    indexes = JSON.parse(foundRecord[0].indexes);
    
    if(indexes.length === 0){
      const newRecord = await createRecord();
      indexes = newRecord.indexes;
    }
  
    console.log(indexes);
    
    return indexes;  
  } catch (err) {
    if(indexes===undefined) {
      const newRecord = await createRecord();
      indexes = newRecord.indexes;
      return indexes;
    } else {
      console.log(err);
    }
  }
};

const task = cron.schedule('*/10 * * * * *', () =>  {
  renderPersons();
}, {
  scheduled: true,
  timezone: 'Europe/London'
}); 

task.start();