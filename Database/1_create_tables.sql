CREATE TABLE IF NOT EXISTS subjects
(
    subject_id INT GENERATED ALWAYS AS IDENTITY,
    subject_abbreviation VARCHAR(10) UNIQUE NOT NULL,
    subject_name VARCHAR(30) NOT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS subjects OWNER TO admin;

CREATE TABLE IF NOT EXISTS unverified_users
(
    unverified_user_id INT GENERATED ALWAYS AS IDENTITY,
    unverified_user_name VARCHAR(30) NOT NULL,
    unverified_user_surname VARCHAR(30) NOT NULL,
    unverified_user_email VARCHAR(40) UNIQUE NOT NULL,
    unverified_user_password_hash VARCHAR(255) NOT NULL,
    unverified_user_verification_code VARCHAR(50) NOT NULL,
    unverified_user_date_of_registration DATE NOT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS unverified_users OWNER TO admin;

CREATE TABLE IF NOT EXISTS users
(
    user_id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    user_name VARCHAR(30) NOT NULL,
    user_surname VARCHAR(30) NOT NULL,
    user_profile_picture_path VARCHAR(30) NULL,
    user_email VARCHAR(40) UNIQUE NOT NULL,
    user_password_hash VARCHAR(256) NOT NULL,
    user_custom_info VARCHAR(512) NOT NULL,
    user_fulltime BOOLEAN NULL,
    user_start_year INT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS users OWNER TO admin;

CREATE TABLE IF NOT EXISTS groups
(
    group_id INT GENERATED ALWAYS AS IDENTITY,
    group_owner INT,
    group_name VARCHAR(50) NOT NULL,
    group_subject VARCHAR(30) NOT NULL,
    group_description VARCHAR(512) NULL,
    group_max_member_count INT NOT NULL,
    group_creation_date DATE NOT NULL,
    group_apply_by_date DATE NOT NULL,
    group_closed BOOLEAN NULL,
    CONSTRAINT fk_owner
      FOREIGN KEY(group_owner)
      REFERENCES users(user_id)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS groups OWNER TO admin;
