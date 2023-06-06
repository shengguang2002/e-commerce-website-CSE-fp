-- SQLite
ALTER TABLE AiPets ADD COLUMN seller DEFAULT 'Hanyang';
UPDATE pets SET seller = 'brian' WHERE PetID > 6;
ALTER TABLE AiPets ADD COLUMN region TEXT;
UPDATE AiPets SET region = CASE WHEN PetID < 7 THEN 'Seattle' ELSE 'China' END;

CREATE TABLE purchase (
  userID INT,
  price INT,
  petID INT,
  `date` DATETIME
);
DROP TABLE Bought;

CREATE TABLE AlPets (
  PetID INT PRIMARY KEY,
  Name VARCHAR(50),
  Price DECIMAL(10, 2),
  Category VARCHAR(50),
  Seller VARCHAR(50),
  Region VARCHAR(50)
);

CREATE TABLE users (
  email VARCHAR(255),
  digit DECIMAL(18,1),
  userID INT
);