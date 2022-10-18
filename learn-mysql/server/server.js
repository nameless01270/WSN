const express = require('express');
const app = express();
const { insertNewData, getAllData, searchByName, deleteDataSensor, updateNameById } = require('./db');

const port = process.env.PORT;
const cors = require('cors');
const dotenv = require('dotenv');
const { response } = require('express');
dotenv.config();

app.use(cors());
app.use(express.json());

// Create data sensor
app.post('/insert', (req, res) => {
    const { ss_id, temp, humidity, light, dust } = req.body;
    const result = insertNewData(ss_id, temp, humidity, light, dust);

    result
    .then(data => res.json({ data: data }))
    .catch(err => console.log(err));
});

// Get all data sensors
app.get('/get-all-data', (req, res) => {
    const result  = getAllData();

    result
    .then(data => res.json({ data: data }))
    .catch(err => console.log(err));
});

// Search data by name
app.get('/search/:name', (req, res) => {
    const { name } = req.params;
    
    const result = searchByName(name);

    result
    .then(data => res.json({ data: data }))
    .catch(err => console.log(err));
});

// Delete data by id
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    const result = deleteDataSensor(id);

    result
    .then(data => res.json({success : data}))
    .catch(err => console.log(err));
});

app.put('/update', (req, res) => {
    const { id, name, location } = req.body;
    const result = updateNameById(id, name, location);

    result
    .then(data => res.json({success : data}))
    .catch(err => console.log(err));
})

app.listen(port, () => console.log(`Listening on port ${port}`));