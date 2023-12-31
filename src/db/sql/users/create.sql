CREATE TABLE users(
  user_id serial PRIMARY KEY,
  username VARCHAR ( 50 ) UNIQUE NOT NULL,
  email VARCHAR ( 40 ) UNIQUE NOT NULL,
  password VARCHAR ( 350 ) NOT NULL,
  email_verified SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP 
)