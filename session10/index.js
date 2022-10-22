const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "wsn",
    password: "123456",
    database: "test1"
}); 

// const createDataDevices = () => {
//     var sql = "INSERT INTO devices (name, note) VALUES ?";
//     var values = [
//         ['led', 'ON OFF'],
//         ['fan', 'ON OFF'],
//         ['television', 'ON OFf'],
//         ['fresh', 'ON OFF'],
//         ['light', 'ON OFF']
//     ];
//     connection.query(sql, [values], function(err) {
//         if (err) throw err;
//         connection.end();
//     });
// }

// createDataDevices();

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const createDataAction = () => {

    for (let i = 0; i < 100; i++) {
        let user_id = getRandom(1,5);
        let device_id = getRandom(1, 100);
        let action = getRandom(1, 5);

        var sql = `INSERT INTO action (user_id, device_id, action) VALUES (${user_id}, ${device_id}, ${action})`;

        connection.query(sql, function(err) {
        if (err) throw err;
        });
    }
}

createDataAction();