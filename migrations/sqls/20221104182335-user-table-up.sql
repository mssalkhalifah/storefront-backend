CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(64) UNIQUE,
  firstname VARCHAR(64),
  lastname VARCHAR(64),
  user_password TEXT 
);
