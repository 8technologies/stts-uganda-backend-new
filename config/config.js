import mysql from "mysql2/promise";

const port = 8001;
const host = "localhost";
const baseUrl = `http://${host}:2222/module_logos/`;
const imagesUrl = `http://${host}:2222`;
const test = "testing123";
const MAX_RESULTS = 1000;


const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  database: "observatory",
  password: "",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
});

export {
  baseUrl,
  port,
  db,
  host,
  MAX_RESULTS,
  imagesUrl
};
