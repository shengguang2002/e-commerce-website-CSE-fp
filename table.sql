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

--DELETE FROM purchase; 拿来重置purchase库