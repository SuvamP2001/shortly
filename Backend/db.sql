
CREATE TABLE Users (

    UserID INT IDENTITY(1,1) PRIMARY KEY,

    Username VARCHAR(255) NOT NULL,

    Password VARCHAR(255) NOT NULL,

    RegistrationDate DATETIME DEFAULT GETDATE()

);
 
CREATE TABLE URL (

    URLID INT IDENTITY(1,1) PRIMARY KEY,

    OriginalURL VARCHAR(255) NOT NULL,

    ShortenedURL VARCHAR(255) NOT NULL,

    CreationDate DATE,

    ExpiryDate DATE,

    UserID INT

);
