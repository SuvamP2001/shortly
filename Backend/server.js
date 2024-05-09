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
  database: "Shortly",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};



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
  const UserID = req.body.UserID;

  const {OriginalURL}=req.body;

  const ShortURL = generateShortURL(OriginalURL);

  console.log(ShortURL);
  const result = await executeQuery(
    "insert into URL (OriginalURL,ShortenedURL,UserID) values ('" +
      req.body.OriginalURL + "','"+ ShortURL+ "','" +UserID+
      "');"
  );

  // const shortURLs = await executeQuery("SELECT ShortenedURL FROM URL WHERE UserID = ?", [UserID]);

  return res.status(201).json({result});
  // return res.status(201).json({result,shortURLs});
});



/*  USERS LIST  API */



app.get("/Users",async(req,res) =>{
  const result = await executeSelect("select Users.UserID,Users.Username,Users.Password,Users.RegistrationDate,URL.OriginalURL,URL.ShortenedURL,URL.CreationDate,URL.ExpiryDate from URL inner join Users on URL.UserID = Users.UserID");
  return res.status(200).json(result);
});


const jwt = require('jsonwebtoken');

app.post("/login", async (req, res) => {
  const username = req.body.Username;
  const password = req.body.Password;
 
  const result = await executeSelect(
    `SELECT TOP 1 * FROM Users WHERE Username = '${username}' AND Password = '${password}'`
  );
 
  if (result.length > 0) {
    // User authenticated successfully, generate JWT token
    const user = result[0];
    const token = jwt.sign({ UserID: user.UserID, Username: user.Username }, 'GYANSYS', { expiresIn: '1h' });
    
    // Return the token in the response body
    return res.status(200).json({ success: true, message: "Login successful", token: token });
  } else {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }
});


app.post("/register", async (req, res) => {
  console.log(req.body);
  const result = await executeQuery(
    "insert into Users (Username,Password) values ('" +
      req.body.Username +
      "','" +
      req.body.Password +
      "');"
  );
  return res.status(201).json(result);
});





app.get("/allUrls", async (req, res) => {
  try {
    // Execute SQL query to retrieve all original and shortened URLs from the URL table
    const result = await executeQuery(
      `SELECT OriginalURL, ShortenedURL FROM URL`
    );

    // Return the result as JSON response
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/userUrls", async (req, res) => {
  const { UserID } = req.query;

  // Check if UserID is provided
  if (!UserID) {
    return res.status(400).json({ success: false, message: "UserID is required" });
  }

  try {
    // Execute SQL query to retrieve OriginalURL and ShortenedURL for the specified UserID
    const result = await executeQuery(
      `SELECT OriginalURL, ShortenedURL FROM URL WHERE UserID = ${UserID}`
    );

    console.log(result);

    // Return the result as JSON response
     return res.status(200).json({ success: true, data: result.recordsets });
    
    // return res.status(200).json(result.recordsets);
    
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});






async function redirectToOriginalURL(shortURL) {
  try {
    // Execute SQL query to find the corresponding original URL for the given short URL
    const result = await executeQuery(
      `SELECT OriginalURL FROM URL WHERE ShortenedURL = '${shortURL}'`
    );
    
    // Check if a matching original URL is found in the database
    if (result.recordset.length > 0) {
      const originalURL = result.recordset[0].OriginalURL;
      // Redirect the user to the original URL
      window.location.href = originalURL;
    } else {
      console.log("Short URL not found in the database");
      // Handle case when short URL is not found
      // For example, display an error message to the user
    }
  } catch (error) {
    console.error("Error fetching original URL:", error);
    // Handle error, such as displaying an error message to the user
  }
}







app.listen(8081, () => {
  console.log("listening");
});
