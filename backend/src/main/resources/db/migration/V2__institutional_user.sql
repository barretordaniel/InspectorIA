CREATE TABLE institutional_user (
  id            BIGSERIAL PRIMARY KEY,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  name          VARCHAR(120) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT now()
);
