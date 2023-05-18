E-commerce API Documentation
Introduction:

Our API provides programmatic access to product data from our e-commerce store. This includes product details such as name, price, quantity, and images. You can use this data to create a customized online store front, perform data analysis, or integrate with other services..


1. Get All Products
Purpose: This endpoint is used to retrieve information about all products available in our store. It includes product name, price, quantity, images, and other related details.
Request Format: /all
Request Type: GET
Returned Data Format: JOSN
Description: Returns a list of all products available in the store, including details like name, price, and images.
Example Request: /all
Example Response:
{
    "name": "Paper towels",
    “Shortname”: “papertowels”,
    "category ": "home goods",
    "price ": "10.00$",
    "color": [
        "white ",
        "Blue",
        "Red"
    ]
}
Error Handling:
 500: Server Error - Something went wrong on our end while processing the request.

2. Get Trending Products
 Purpose: This endpoint allows clients to retrieve information about trending products based on specified parameters such as name and color. It is particularly useful for highlighting popular products to customers.
Request Format: /trend endpoint with parameters of name and color
Request Type: POST
Returned Data Format: Plain text
Description: Return a list of product information including price, name, products images.
Example Request: /trend/papertowls/white
Example Response: 1 in home good
Errors Handling:
400: Bad Request - The request was unacceptable, typically due to missing or incorrect parameters.
500: Server Error - Something went wrong on our end while processing the request.

