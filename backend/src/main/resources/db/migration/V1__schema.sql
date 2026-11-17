CREATE TABLE damage_type (id SMALLINT PRIMARY KEY, name VARCHAR(30) NOT NULL UNIQUE);
CREATE TABLE severity    (id SMALLINT PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE);
INSERT INTO damage_type VALUES (1,'Hueco'),(2,'Grieta'),(3,'Hundimiento'),(4,'Andén roto');
INSERT INTO severity    VALUES (1,'leve'),(2,'moderado'),(3,'grave');

CREATE SEQUENCE report_code_seq START 1;

CREATE TABLE report (
  id            BIGSERIAL PRIMARY KEY,
  code          VARCHAR(20) NOT NULL UNIQUE,
  damage_type_id SMALLINT NOT NULL REFERENCES damage_type(id),
  severity_id   SMALLINT NOT NULL REFERENCES severity(id),
  confidence    SMALLINT NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  address       VARCHAR(200) NOT NULL,
  neighborhood  VARCHAR(100),
  latitude      DOUBLE PRECISION NOT NULL,
  longitude     DOUBLE PRECISION NOT NULL,
  comment       VARCHAR(500),
  photo_path    VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_report_created ON report(created_at DESC);
CREATE INDEX idx_report_filters ON report(damage_type_id, severity_id);
