CREATE TABLE order_status (
  id INT PRIMARY KEY,
  status VARCHAR(16)
);

INSERT INTO order_status (id, status) VALUES(1, 'active');
INSERT INTO order_status (id, status) VALUES(2, 'complete');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status_id INT REFERENCES order_status(id),
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_products (
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES product(id),
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
