-- SQL Commands to set up the SocioSphere database in MySQL

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS sociosphere_db;

-- (Optional) Create a specific user for the application
-- CREATE USER 'sociosphere_user'@'localhost' IDENTIFIED BY 'your_password_here';
-- GRANT ALL PRIVILEGES ON sociosphere_db.* TO 'sociosphere_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Use the database
USE sociosphere_db;

-- Note: Sequelize will automatically create the tables when you start the server
-- provided that the database user has sufficient permissions.
