const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const dotenv = require("dotenv");
const {
  createTable,
  insertNewData,
  sendDataToClient,
  getAllData,
  searchByName,
  deleteDataSensor,
  updateNameById,
  getLastData,
} = require("./db");
const path = require("path");

// set up environment
dotenv.config();

app.use(express.static("client"));

app.get("/dashboard", (req, res) => {
  res.sendFile("./client/views/dashboard.html", { root: __dirname });
});

app.get("/statistics", (req, res) => {
  res.sendFile("./client/views/statistics.html", { root: __dirname });
});

io.on("connection", (socket) => {
  console.log("New Ws connection");
});

// Get all data sensors
app.get("/get-all-data", (req, res) => {
  const result = getAllData();

  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

// Search data by name
app.get("/search/:name", (req, res) => {
  const { name } = req.params;

  const result = searchByName(name);

  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

// Delete data by id
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  const result = deleteDataSensor(id);

  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

// Update data by id
app.put("/update", (req, res) => {
  const { id, name, location } = req.body;
  const result = updateNameById(id, name, location);

  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

// Get last data sensor
app.get("/get-last-data", (req, res) => {
  const result = getLastData();

  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

server.listen(process.env.PORT, () =>
  console.log(`Server listening on port: ${process.env.PORT}`)
);

// Create Table
createTable();

const mqtt = require("mqtt");

// Connect to mqtt
const options = {
  // host: process.env.HOST_MQTT,
  // port: process.env.PORT_MQTT,
  // protocol: process.env.PROTOCOL_MQTT,
  // username: process.env.USERNAME_MQTT,
  // password: process.env.PASSWORD_MQTT,
  clientID: process.env.CLIENTID,
  username: process.env.USERNAME_MQTT,
  password: process.env.PASSWORD_MQTT,
  host: process.env.HOST_MQTT,
  port: process.env.PORT_MQTT,
};
// mosquitto_sub -h broker.mqttdashboard.com -t place/data/sensors
// initialize the MQTT client
const client = mqtt.connect(options);

// setup the callbacks
client.on("connect", function () {
  console.log("Connected to MQTT");
});

client.on("error", function (error) {
  console.log(error);
});

// subscribe to topic 'my/test/topic'
client.subscribe("place/data/sensors");

client.on("message", function (topic, message) {
  // called each time a message is received
  console.log("message is " + message);
  console.log("topic is " + topic);
  const data = JSON.parse(message);
  console.log(Math.round(data.temperature));

  const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const newDataTemp = Math.round(data.temperature);
  const newDataHumidity = Math.round(data.humidity);
  const newDataLight = Math.round(data.light);
  const newDataDust = getRandom(1, 100);

  let ss_id = getRandom(1, 5);

  // Insert new data into database
  insertNewData(ss_id, newDataTemp, newDataHumidity, newDataLight, newDataDust);

  // Send data to client
  sendDataToClient(io);
});

io.on("connection", function (socket) {
  console.log(socket.id + " connected");
  socket.on("disconnect", function () {
    console.log(socket.id + " disconnected");
  });

  socket.on("Led1", function (data) {
    if (data == "on") {
      console.log("Led1 ON");
      client.publish("turn-led1", "on");
    } else {
      console.log("Led1 OFF");
      client.publish("turn-led1", "off");
    }
  });

  socket.on("Led2", function (data) {
    if (data == "on") {
      console.log("Led2 ON");
      client.publish("turn-led2", "on");
    } else {
      console.log("Led2 OFF");
      client.publish("turn-led2", "off");
    }
  });
});
