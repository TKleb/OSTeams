CREATE TABLE IF NOT EXISTS subjects
(
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    abbreviation VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(30) NOT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS subjects OWNER TO admin;

CREATE TABLE IF NOT EXISTS unverified_users
(
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    name VARCHAR(30) NOT NULL,
    surname VARCHAR(30) NOT NULL,
    email VARCHAR(40) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    date_of_registration TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS unverified_users OWNER TO admin;

CREATE TABLE IF NOT EXISTS users
(
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    name VARCHAR(30) NOT NULL,
    surname VARCHAR(30) NOT NULL,
    profile_picture_path VARCHAR(30) NULL,
    email VARCHAR(40) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    custom_info VARCHAR(512) NOT NULL DEFAULT '',
    fulltime BOOLEAN NULL,
    start_year INT NULL,
    date_of_registration TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS users OWNER TO admin;

CREATE TABLE IF NOT EXISTS groups
(
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    owner_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    subject_id INT NOT NULL,
    description VARCHAR(512) NULL,
    max_member_count INT NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    apply_by_date TIMESTAMP WITH TIME ZONE NOT NULL,
    closed BOOLEAN NULL,
    CONSTRAINT fk_owner
      FOREIGN KEY(owner_id)
      REFERENCES users(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_subject
      FOREIGN KEY(subject_id)
      REFERENCES subjects(id)
      ON DELETE CASCADE
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS groups OWNER TO admin;

CREATE TABLE IF NOT EXISTS group_applications
(
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    text VARCHAR,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    closed BOOLEAN NOT NULL,
    CONSTRAINT fk_group
      FOREIGN KEY(group_id)
      REFERENCES groups(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_user
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS group_applications OWNER TO admin;

CREATE TABLE IF NOT EXISTS group_memberships
(
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    member_since TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_group
      FOREIGN KEY(group_id)
      REFERENCES groups(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_user
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_unique
        UNIQUE (user_id, group_id)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS group_memberships OWNER TO admin;
