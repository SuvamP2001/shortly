const express = require('express');
const nodemailer = require('nodemailer');
const sql = require('mssql');
var bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const validUrl = require('valid-url');
const shortid = require('shortid');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connection String
const pool = {
  user: 'sa',
  password: 'sa',
  server: 'IN-JTF3NX3',
  database: 'shortly_db',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.get('/', (re, res) => {
  return res.json('From Backend Side');
});

async function executeSelect(query) {
  try {
    console.log(query);
    await sql.connect(pool);
    console.log('Connected to SQL Server');

    const result = await sql.query(query);
    console.log('Result : ', result);

    await sql.close();
    console.log('Connection closed');
    return result.recordsets[0];
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function executeQuery(query) {
  try {
    console.log(query);
    await sql.connect(pool);
    console.log('Connected to SQL Server');

    const result = await sql.query(query);
    console.log('Result : ', result);

    await sql.close();
    console.log('Connection closed');
    return { affectedRows: result.rowsAffected[0] };
  } catch (error) {
    console.error('Error:', error.message);
  }
}

app.all('/:shorten_code', async (req, res) => {
  const shortenCode = req.params.shorten_code;

  try {
    const result = await executeSelect(
      `SELECT OriginalURL FROM URL WHERE ShortenedURL = '${shortenCode}'`
    );

    console.log('record set', result.length);
    if (result.length > 0) {
      const originalURL = result[0].OriginalURL;
      return res.status(301).redirect(originalURL);
    } else {
      return res.status(404).json({ error: 'Shortened URL not found' });
    }
  } catch (error) {
    console.error('Error retrieving original URL:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

app.post('/shorten/saveURL', async (req, res) => {
  const { OriginalURL } = req.body;

  const baseURL = `http://localhost:8081/`;

  if (!validUrl.isUri(OriginalURL)) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const shortURL = shortid.generate();

  const result = await executeQuery(
    "insert into URL (OriginalURL,ShortenedURL) values ('" + OriginalURL + "','" + shortURL + "');"
  );

  return res.status(201).json({ shorten_url: `${baseURL}${shortURL}` });
});

/*  USERS LIST  API */

app.get('/Users', async (req, res) => {
  const result = await executeSelect(
    'select Users.UserID,Users.Username,Users.Password,Users.RegistrationDate,URL.OriginalURL,URL.ShortenedURL,URL.CreationDate,URL.ExpiryDate from URL inner join Users on URL.UserID = Users.UserID'
  );
  return res.status(200).json(result);
});

const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  const username = req.body.Username;
  const password = req.body.Password;

  const result = await executeSelect(
    `SELECT TOP 1 UserID, Username FROM Users WHERE Username = '${username}' AND Password = '${password}'`
  );

  if (result.length > 0) {
    const user = result[0];
    const token = jwt.sign({ UserID: user.UserID, Username: user.Username }, 'GYANSYS', {
      expiresIn: '1h',
    });

    return res
      .status(200)
      .json({ success: true, message: 'Login successful', token: token, UserID: user.UserID });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

app.post('/register', async (req, res) => {
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

app.get('/allUrls', async (req, res) => {
  try {
    const result = await executeQuery(`SELECT OriginalURL, ShortenedURL FROM URL`);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/userUrls', async (req, res) => {
  const { UserID } = req.query;

  if (!UserID) {
    return res.status(400).json({ success: false, message: 'UserID is required' });
  }

  try {
    const result = await executeQuery(
      `SELECT OriginalURL, ShortenedURL FROM URL WHERE UserID = ${UserID}`
    );

    console.log(result);

    return res.status(200).json({ success: true, data: result.recordsets });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

async function redirectToOriginalURL(shortURL) {
  try {
    const result = await executeQuery(
      `SELECT OriginalURL FROM URL WHERE ShortenedURL = '${shortURL}'`
    );

    if (result.recordset.length > 0) {
      const originalURL = result.recordset[0].OriginalURL;
      window.location.href = originalURL;
    } else {
      console.log('Short URL not found in the database');
    }
  } catch (error) {
    console.error('Error fetching original URL:', error);
  }
}

app.listen(8081, () => {
  console.log('listening');
});
