CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT GENERATED ALWAYS AS IDENTITY,
    subject_abbreviation VARCHAR(10) UNIQUE NOT NULL,
    subject_name VARCHAR(30) NOT NULL
) TABLESPACE pg_default;

ALTER TABLE subjects OWNER TO admin;