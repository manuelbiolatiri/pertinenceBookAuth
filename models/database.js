const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// connect to heroku database
// const connection = {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true
// };

// connect to dev database
const connection = {
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
};

// pool
const pool = new pg.Pool(connection);

pool.on('connect', () => {})

// user table
const usersTable = async () => {
    const userTableQuery = `CREATE TABLE IF NOT EXISTS
    users(
        id SERIAL PRIMARY KEY NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(200) NOT NULL,
        verification VARCHAR(200),
        active VARCHAR(200),
        phone VARCHAR(50),
        joined TIMESTAMP NOT NULL
    )`;

    try {
        await pool.query(userTableQuery);
        console.log('users table created')
    }
    catch (e) {
        console.log(e)
    }
};

const bookTables = async () => {
    const bookTable = `CREATE TABLE IF NOT EXISTS
      books(
            id SERIAL PRIMARY KEY NOT NULL UNIQUE,
            userId VARCHAR(128) NOT NULL,
            bookname VARCHAR(128) NOT NULL,
            pins VARCHAR(128),
            created TIMESTAMP DEFAULT NOW()
        )`;

     try {
        await pool.query(bookTable);
        console.log('contracts table created')
    }
    catch (e) {
        console.log(e)
    }
};


usersTable();
bookTables();

// export pool to controllers
module.exports = pool;