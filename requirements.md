# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index
- Show
- Create [token required]
- Products by category

#### Users

- Index [token required]
- Show [token required]
- Create [token required]
- Current User [token required]
- Logout [token required]
- Login

#### Orders

- Index [token required]
- Create [token required]
- Show [token required]
- Get all order products by order's id [token required]
- Add product to order [token required]
- Update a product's quantity in an order [token required]
- Set an order's status to complete [token required]

## Data Shapes

#### Product

- id
- user_id
- name
- price
- category

#### User

- id
- email
- firstName
- lastName
- password

#### Orders

- id
- status_id
- user_id

#### order_product

- order_id
- product_id
- quantity

## Database schema

#### product

CREATE TABLE product (
id SERIAL PRIMARY KEY,
name VARCHAR(256),
price NUMERIC(12,2),
category VARCHAR(64),
user_id INT REFERENCES users(id) ON DELETE CASCADE
);

#### users

CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(64) UNIQUE,
firstname VARCHAR(64),
lastname VARCHAR(64),
user_password TEXT
);

#### orders

CREATE TABLE orders (
id SERIAL PRIMARY KEY,
status_id INT REFERENCES order_status(id),
user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

#### order_products

CREATE TABLE order_products (
order_id INT REFERENCES orders(id),
product_id INT REFERENCES product(id),
quantity INT NOT NULL,
PRIMARY KEY (order_id, product_id)
);

#### order_status

CREATE TABLE order_status (
id INT PRIMARY KEY,
status VARCHAR(16)
);
