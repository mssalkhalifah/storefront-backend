# storefront-backend-api

This is a project for Full Stack JavaScript Developer - MCIT Nanodegree Program. And the goal of this project is to create a storefront backend using nodejs, express and postgres.

## Requirements

[![docker](https://www.docker.com/wp-content/uploads/2022/03/horizontal-logo-monochromatic-white.png)](https://www.docker.com/)

## Recommended

[![postman](https://symbiotics.co.za/wp-content/uploads/2017/10/postman-logo.png)](https://www.postman.com/)

## Installation

```
$ git clone https://github.com/mssalkhalifah/storefront-backend.git
$ cd storefront-backend
$ cp .env.example ./.env
$ docker-compose up
```

Database's port is 5432 and node is 3000.

## Postman

If using postman here is the list of collections to import:
| Collection name | JSON link |
|:-------------:|:-|
| Order |https://www.getpostman.com/collections/e3bf39c442aadfad62f5|
| Products |https://www.getpostman.com/collections/2a9516464a64370ef011|
| User |https://www.getpostman.com/collections/987acda15acdac2139f9|

## API endpoints

### Orders

| Type | Enpoints                                                 | Description                                    |
| :--: | :------------------------------------------------------- | :--------------------------------------------- |
| GET  | /orders                                                  | Get all orders                                 |
| GET  | /order/:id                                               | Get an order by id                             |
| GET  | /order/:id/orderProducts                                 | Get all orderProducts that belongs to an order |
| POST | /order/create                                            | Create an order                                |
| POST | /order/:id/addProduct                                    | Add a product into an order                    |
| POST | /order/:id/product/:productId/update/quantity/:quantitiy | Updates an order product's quantity            |
| POST | /order/:id/setcomplete                                   | Set an order's status to complete              |

### Products

| Type | Enpoints                     | Description                  |
| :--: | :--------------------------- | :--------------------------- |
| GET  | /products                    | Get all products             |
| GET  | /products/category/:category | Get all products by category |
| GET  | /products/:id                | Get product by id            |
| POST | /product                     | Create and add a product     |

### Users

| Type | Enpoints      | Description              |
| :--: | :------------ | :----------------------- |
| GET  | /user/get/:id | Get a user by id         |
| GET  | /user/all     | Get all users            |
| GET  | /user/me      | Get current user         |
| POST | /user/create  | Create a new user        |
| POST | /user/logout  | Logout current user      |
| POST | /user/login   | Login with existing user |

## Database schema

![database](https://res.cloudinary.com/domq50ciy/image/upload/v1668245515/storefront_schema_2_oasikj.png)
