# Future Pet API Documentation

The Future Pet API provides endpoints to retrieve information about available pets, perform searches, handle user login, purchase history.


## Get All Pets

- **Endpoint**: `/all`
- **Method**: GET
- **Description**: Retrieve a list of all available future pets.
- **Request Format**: N/A
- **Response Format**: JSON

**Example Request:**
```
GET /all
```

**Example Response:**
```json
{
  "Pets": [
    {
      "Name": "dd",
      "Price": 50,
      "PetID": 1,
      "seller": "Brian",
      "region": "china",
      "category": "Cat"
    },
    {
      "Name": "wiw",
      "Price": 75,
      "PetID": 2,
      "seller": "Brian",
      "region": "china",
      "category": "Dog"
    },
    ...
  ]
}
```

**Error Handling:**
Possible 500 (server error) SERVER_ERROR

## Search for Pets

- **Endpoint**: `/search`
- **Method**: POST
- **Description**: Search for pets based on a specific criteria (e.g., name, category).
- **Request Format**: JSON
  - `search` (required): The search keyword.
  - `type` (required): The type of search criteria (e.g., name, category).
- **Response Format**: JSON

**Example Request:**
```
POST /search
Body:
{
  "search": "BB",
  "type": "name"
}
```

**Example Response:**
```json
[
  {
    "PetID": 1
  },
  {
    "PetID": 5
  }
]
```

**Error Handling:**
Possible 400 (invalid request) error if search or search type is not provided
Possible 500 (server error) SERVER_ERROR

## User Login

- **Endpoint**: `/login`
- **Method**: POST
- **Description**: Authenticate a user by checking their email and password.
- **Request Format**: JSON
  - `name` (required): The user's email.
  - `password` (required): The user's password.
- **Response Format**: Text

**Example Request:**
```
POST /login
Body:
{
  "name": "moazzed@uneunu.lr",
  "password": "4952072"
}
```

**Example Response:**
```
[1]
```

**Error Handling:**
Possible 400 (invalid request) error if account is not founded
Possible 500 (server error) SERVER_ERROR

## User Information

- **Endpoint**: `/info/:email/:digit`
- **Method**: GET
- **Description**: Retrieve user information based on their email and digit.
- **Request Format**: URL parameters
  - `email` (required): The user's email.
  - `digit` (required): The user's digit.
- **Response Format**: JSON

**Example Request:**
```
GET /info/moazzed@uneunu.lr/4952072
```

**Example Response:**
```json
{
  "userID": 1
}
```

**Error Handling:**
Possible 400 (invalid request) error if email or digit is not provided
Possible 500 (server error) SERVER_ERROR

## Buy a Pet

- **Endpoint**: `/buy`
- **Method**: POST
- **Description**: Purchase a pet by providing the user ID, price, and pet ID.
- **Request Format**: JSON
  - `userID` (required): The user ID making the purchase.
  - `price` (required): The price of the pet.
  - `petID` (required): The ID of the pet being purchased.
- **Response Format**: N/A

**Example Request:**
```
POST /buy
Body:
{
  "userID": 1,
  "price": 50,
  "petID": 1
}
```

**Example Response:**
```
Status: 200 OK
```

**Error Handling:**
Possible 400 (invalid request) error if userID or price or petID is not provided
Possible 500 (server error) SERVER_ERROR

## Purchase History

- **Endpoint**: `/purchasehistory`
- **Method**: GET


- **Description**: Retrieve the purchase history of a user based on their user ID.
- **Request Format**: Query parameter
  - `userID` (required): The user ID to retrieve the purchase history for.
- **Response Format**: JSON

**Example Request:**
```
GET /purchasehistory?userID=1
```

**Example Response:**
```json
[
  {
    "userID": 1,
    "price": 50,
    "petID": 1,
    "date": "2023-06-01 12:34:56"
  },
  {
    "userID": 1,
    "price": 75,
    "petID": 2,
    "date": "2023-06-02 09:12:34"
  },
  ...
]
```

**Error Handling:**
Possible 400 (invalid request) error if userID is not provided
Possible 500 (server error) SERVER_ERROR

## User Recommendations

- **Endpoint**: `/rec/:user`
- **Method**: GET
- **Description**: Get recommendations for a user based on their user ID. It
                    will return all of the pet under the user account
- **Request Format**: URL parameter
  - `user` (required): The user ID to get recommendations for.
- **Response Format**: JSON

**Example Request:**
```
GET /rec/1
```

**Example Response:**
```json
[
  {
    "Name": "ui",
    "Price": 50,
    "category": "Cat",
    "LastPetID": 10
  },
  {
    "Name": "iu",
    "Price": 75,
    "category": "Dog",
    "LastPetID": 10
  },
  ...
]
```

**Error Handling:**
Possible 400 (invalid request) error if user is not provided
Possible 500 (server error) SERVER_ERROR

## Get Pet Information

- **Endpoint**: `/get`
- **Method**: POST
- **Description**: Retrieve detailed information about a pet based on its pet ID.
- **Request Format**: JSON
  - `petID` (required): The ID of the pet to retrieve information for.
- **Response Format**: JSON

**Example Request:**
```
POST /get
Body:
{
  "petID": 1
}
```

**Example Response:**
```json
[
  {
    "Name": "bb",
    "Price": 50,
    "category": "Cat",
    "LastPetID": 10
  }
]
```
**Error Handling:**
Possible 400 (invalid request) error if petID is not provided
Possible 500 (server error) SERVER_ERROR