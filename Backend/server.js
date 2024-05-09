const express = require("express");
const nodemailer = require("nodemailer");
const sql = require("mssql");
var bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connection String
const pool = {
  user: "sa",
  password: "sa",
  server: "IN-9XF3NX3",
  database: "userdata",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

//Email config
// let config = {
//   host: "smtp.gmail.com",
//   port: 587,
//   auth: {
//     user: "dev.ashwinalexander@gmail.com",
//     pass: "fsqxginpqingrcnn",
//   },
// };

// let transporter = nodemailer.createTransport(config);
// transporter.verify().then(console.log).catch(console.error);

app.get("/", (re, res) => {
  return res.json("From BAckend Side");
});

async function executeSelect(query) {
  try {
    console.log(query);
    await sql.connect(pool);
    console.log("Connected to SQL Server");

    const result = await sql.query(query);
    console.log("Result : ", result);

    await sql.close();
    console.log("Connection closed");
    return result.recordsets[0];
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function executeQuery(query) {
  try {
    console.log(query);
    await sql.connect(pool);
    console.log("Connected to SQL Server");

    const result = await sql.query(query);
    console.log("Result : ", result);

    await sql.close();
    console.log("Connection closed");
    return { affectedRows: result.rowsAffected[0] };
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// function generatedShortURL(OriginalURL){

//   console.log("Short url:: ",Buffer.from(OriginalURL).toString('base64').slice(0,8));
//   return Buffer.from(OriginalURL).toString('base64').slice(0,8);
// }

const crypto = require('crypto');

function generateUniqueIdentifier(originalURL) {
    const hash = crypto.createHash('sha256');
    hash.update(originalURL);
    return hash.digest('hex');
}
function generateShortURL(originalURL) {
    const uniqueIdentifier = generateUniqueIdentifier(originalURL);
    return Buffer.from(uniqueIdentifier).toString('base64').slice(0, 8);
}

app.post("/saveURL", async (req, res) => {
  console.log(req.body);

  const {OriginalURL}=req.body;

  const ShortURL = generateShortURL(OriginalURL);

  console.log(ShortURL);
  const result = await executeQuery(
    "insert into URL (OriginalURL,ShortURL) values ('" +
      req.body.OriginalURL + "','"+ ShortURL+
      "');"
  );
  return res.status(201).json(result);
});


app.get("/:shortURL", async (req, res) => {
    const shortURL = req.params.shortURL;
  
    try {
      // Query the database to retrieve the original URL corresponding to the short URL
      const result = await executeQuery(
        "SELECT OriginalURL FROM URL WHERE ShortURL = '" + shortURL + "'"
      );
  
      
  
      // Redirect the user to the retrieved original URL
      res.redirect(result.recordset[0].OriginalURL);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

app.listen(8081, () => {
  console.log("listening");
});
