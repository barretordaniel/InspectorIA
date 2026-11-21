-- Hibernate valida que el tipo coincida con el de la entidad (int -> INTEGER).
ALTER TABLE report ALTER COLUMN confidence     TYPE INTEGER;
ALTER TABLE report ALTER COLUMN damage_type_id TYPE INTEGER;
ALTER TABLE report ALTER COLUMN severity_id    TYPE INTEGER;
