const mysql = require("mysql");
const dotenv = require("dotenv");
const { connect } = require("mqtt");

dotenv.config();

// Connect to mysql
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to mySQL");
});

// Create table
const createTable = () => {
  const query =
    "CREATE TABLE IF NOT EXISTS `datasensors` (`id` INT(10) AUTO_INCREMENT PRIMARY KEY, `ss_id` INT(10), `temp` INT(10), `humidity` INT(10), `light` INT(10), `dust` INT(10), `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);";
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.log("Created table successfully!");
  });
};

// Insert data into table
const insertNewData = (ss_id, temp, humidity, light, dust) => {
  const query =
    "INSERT INTO datasensors (ss_id, temp, humidity, light, dust) VALUES (?, ?, ?, ?, ?);";
  connection.query(
    query,
    [ss_id, temp, humidity, light, dust],
    (err, result) => {
      if (err) throw err;
      console.log("Inserted successfully");
      console.log(result);
    }
  );
};

// Send data to client
const sendDataToClient = (io) => {
  var createdAt;
  var newDataTemp;
  var newDataHumidity;
  var newDataLight;
  var newDataDust;
  const query = "SELECT * FROM datasensors ORDER BY ID DESC limit 1;";
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.log("Selected successfully");

    result.forEach((value) => {
      createdAt = value.created_at;
      newDataTemp = value.temp;
      newDataHumidity = value.humidity;
      newDataLight = value.light;
      newDataDust = value.dust;
      console.log(
        createdAt +
          " " +
          value.temp +
          " " +
          value.humidity +
          " " +
          value.light +
          " " +
          value.dust
      );

      io.sockets.emit("send-update-data-sensors", {
        id: value.id,
        temp: value.temp,
        humidity: value.humidity,
        light: value.light,
        dust: value.dust,
        created_at: value.created_at,
      });
    });
  });
};

// Get all data
const getAllData = async () => {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT datasensors.id, datasensors.ss_id, sensors.name , datasensors.temp, datasensors.humidity, datasensors.light, datasensors.dust, sensors.location, datasensors.created_at FROM sensors INNER JOIN datasensors ON sensors.id=datasensors.ss_id ORDER BY datasensors.created_at DESC;";
            connection.query(query, (err, result) => {
                if(err) reject(new Error(err.message));
                resolve(result);
            })
        });
        return response;

    } catch (error) {
        console.log(error);
    }
};

// Search data by name sensor
const searchByName = async (name) => {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT datasensors.id, datasensors.ss_id, sensors.name , datasensors.temp, datasensors.humidity, datasensors.light, datasensors.dust, sensors.location, datasensors.created_at FROM sensors INNER JOIN datasensors ON sensors.id=datasensors.ss_id WHERE name = ? ORDER BY datasensors.created_at DESC;";
            
            connection.query(query, [name], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            })
        });

        return response;
    } catch (error) {
        console.log(error)
    }
}

// Delete data sensor
const deleteDataSensor = async (id) => {
    try {
        id = parseInt(id, 10);
        const response = await new Promise((resolve, reject) => {
            const query = "DELETE FROM datasensors WHERE id = ?";

            connection.query(query, [id], (err, result) => {
                if(err) reject(new Error(err.message));
                resolve(result);
            })
        });

        return response.affectedRows === 1 ? true : false;
    } catch (error) {
        console.log(error);
    }
}

// Update data sensor by id
const updateNameById = async (id, name, location) => {
    try {
        id = parseInt(id, 10);
        const response = await new Promise((resolve, reject) => {
            const query = "UPDATE sensors SET name = ?, location = ? WHERE id = ?";

            connection.query(query, [name, location, id], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            })
        });
        return response.affectedRows === 1 ? true : false;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { createTable, insertNewData, sendDataToClient, getAllData, searchByName, deleteDataSensor, updateNameById };
