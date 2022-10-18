

CREATE TABLE `sensors` (
    `id` INT(10) AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `location` VARCHAR(255),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `datasensors` (
    `id` INT(10) AUTO_INCREMENT PRIMARY KEY,
    `ss_id` INT(10),
    `temp` INT(10),
    `humidity` INT(10),
    `light` INT(10),
    `dust` INT(10),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sensors (name , location) VALUES ('PTIT', 'Ha Dong');
INSERT INTO sensors (name , location) VALUES ('Ho Guom', 'Ha Noi');
INSERT INTO sensors (name , location) VALUES ('Hoi An', 'Da Nang');
INSERT INTO sensors (name , location) VALUES ('Nguyen Hue', 'Ho Chi Minh');
INSERT INTO sensors (name , location) VALUES ('Van Mieu', 'Ha Noi');


INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (1, 10, 20, 30, 40);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (1, 11, 21, 31, 41);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (1, 12, 22, 32, 42);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (1, 13, 23, 33, 43);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (1, 14, 24, 34, 44);

INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (2, 10, 20, 30, 40);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (2, 11, 21, 31, 41);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (2, 12, 22, 32, 42);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (2, 13, 23, 33, 43);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (2, 14, 24, 34, 44);

INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (3, 10, 20, 30, 40);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (3, 11, 21, 31, 41);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (3, 12, 22, 32, 42);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (3, 13, 23, 33, 43);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (3, 14, 24, 34, 44);

INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (4, 10, 20, 30, 40);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (4, 11, 21, 31, 41);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (4, 12, 22, 32, 42);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (4, 13, 23, 33, 43);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (4, 14, 24, 34, 44);

INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (5, 10, 20, 30, 40);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (5, 11, 21, 31, 41);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (5, 12, 22, 32, 42);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (5, 13, 23, 33, 43);
INSERT INTO datasensors (ss_id , temp, humidity, light, dust) VALUES (5, 14, 24, 34, 44);

SELECT ss_id, MAX(temp), created_at FROM datasensors WHERE ss_id = 1;

SELECT * FROM datasensors WHERE ss_id = 5 ORDER BY light DESC;

SELECT * FROM datasensors WHERE temp > 12 AND humidity > 23;

SELECT sensors.name , datasensors.temp, datasensors.humidity, datasensors.light, datasensors.dust, sensors.location, datasensors.created_at
FROM sensors
INNER JOIN datasensors ON sensors.id=datasensors.ss_id
ORDER BY datasensors.created_at DESC;

SELECT sensors.name , datasensors.temp, datasensors.humidity, datasensors.light, datasensors.dust, sensors.location, datasensors.created_at
FROM sensors
INNER JOIN datasensors ON sensors.id=datasensors.ss_id
WHERE name = 'PTIT'
ORDER BY datasensors.created_at DESC;

CREATE USER 'wsn'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'wsn'@'localhost' WITH GRANT OPTION;

SHOW GRANTS FOR 'wsn'@'localhost';

SET PASSWORD FOR 'wsn'@'localhost' = PASSWORD('123456');

FLUSH PRIVILEGES;