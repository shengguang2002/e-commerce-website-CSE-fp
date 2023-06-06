# Future Pet API Documentation

The Future Pet API provides endpoints to retrieve information about available pets, perform searches, handle user login, purchase history.


## Get All Pets

- **Endpoint**: `/all`
- **Method**: GET
- **Description**: Retrieve a list of all available future pets.
- **Request Format**: N/A
- **Response Format**: JSON

Example Request:
```
GET /all
```

Example Response:
```json
{
  "Pets": [
    {
      "Name": "DD",
      "Price": 50,
      "PetID": 1,
      "seller": "Brian",
      "region": "china",
      "category": "Cat"
    },
    {
      "Name": "WIW",
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

## Search for Pets

- **Endpoint**: `/search`
- **Method**: POST
- **Description**: Search for pets based on a specific criteria (e.g., name, category).
- **Request Format**: JSON
  - `search` (required): The search keyword.
  - `type` (required): The type of search criteria (e.g., name, category).
- **Response Format**: JSON

Example Request:
```
POST /search
Body:
{
  "search": "BB",
  "type": "name"
}
```

Example Response:
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

## User Login

- **Endpoint**: `/login`
- **Method**: POST
- **Description**: Authenticate a user by checking their email and password.
- **Request Format**: JSON
  - `name` (required): The user's email.
  - `password` (required): The user's password.
- **Response Format**: Text

Example Request:
```
POST /login
Body:
{
  "name": "moazzed@uneunu.lr",
  "password": "4952072"
}
```

Example Response:
```
[1]
```

## User Information

- **Endpoint**: `/info/:email/:digit`
- **Method**: GET
- **Description**: Retrieve user information based on their email and digit.
- **Request Format**: URL parameters
  - `email` (required): The user's email.
  - `digit` (required): The user's digit.
- **Response Format**: JSON

Example Request:
```
GET /info/moazzed@uneunu.lr/4952072
```

Example Response:
```json
{
  "userID": 1
}
```

## Buy a Pet

- **Endpoint**: `/buy`
- **Method**: POST
- **Description**: Purchase a pet by providing the user ID, price, and pet ID.
- **Request Format**: JSON
  - `userID` (required): The user ID making the purchase.
  - `price` (required): The price of the pet.
  - `petID` (required): The ID of the pet being purchased.
- **Response Format**: N/A

Example Request:
```
POST /buy
Body:
{
  "userID": 1,
  "price": 50,
  "petID": 1
}
```

Example Response:
```
Status: 200 OK
```

## Purchase History

- **Endpoint**: `/purchasehistory`
- **Method**: GET


- **Description**: Retrieve the purchase history of a user based on their user ID.
- **Request Format**: Query parameter
  - `userID` (required): The user ID to retrieve the purchase history for.
- **Response Format**: JSON

Example Request:
```
GET /purchasehistory?userID=1
```

Example Response:
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

## User Recommendations

- **Endpoint**: `/rec/:user`
- **Method**: GET
- **Description**: Get recommendations for a user based on their user ID. It
                    will return all of the pet under the user account
- **Request Format**: URL parameter
  - `user` (required): The user ID to get recommendations for.
- **Response Format**: JSON

Example Request:
```
GET /rec/1
```

Example Response:
```json
[
  {
    "Name": "UI",
    "Price": 50,
    "category": "Cat",
    "LastPetID": 10
  },
  {
    "Name": "IU",
    "Price": 75,
    "category": "Dog",
    "LastPetID": 10
  },
  ...
]
```

## Get Pet Information

- **Endpoint**: `/get`
- **Method**: POST
- **Description**: Retrieve detailed information about a pet based on its pet ID.
- **Request Format**: JSON
  - `petID` (required): The ID of the pet to retrieve information for.
- **Response Format**: JSON

Example Request:
```
POST /get
Body:
{
  "petID": 1
}
```

Example Response:
```json
[
  {
    "Name": "BB",
    "Price": 50,
    "category": "Cat",
    "LastPetID": 10
  }
]
```