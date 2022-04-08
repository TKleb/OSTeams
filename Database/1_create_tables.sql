CREATE TABLE IF NOT EXISTS subjects
(
    subject_id INT GENERATED ALWAYS AS IDENTITY,
    subject_abbreviation VARCHAR(10) NOT NULL,
    subject_name VARCHAR(30) NOT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS subjects OWNER TO admin;

CREATE TABLE IF NOT EXISTS unverifiedUsers
(
    unverifiedUser_id INT GENERATED ALWAYS AS IDENTITY,
    unverifiedUser_name VARCHAR(30) NOT NULL,
    unverifiedUser_surname VARCHAR(30) NOT NULL,
    unverifiedUser_email VARCHAR(40) NOT NULL,
    unverifiedUser_passwordHashed VARCHAR(255) NOT NULL,
    unverifiedUser_verificationCode VARCHAR(50) NOT NULL,
    unverifiedUser_dateOfRegistration DATE NOT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS unverifiedUsers OWNER TO admin;

CREATE TABLE IF NOT EXISTS users
(
    user_id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    user_name VARCHAR(30) NOT NULL,
    user_surname VARCHAR(30) NOT NULL,
    user_profilePicturePath VARCHAR(30) NULL,
    user_email VARCHAR(40) NOT NULL,
    user_password VARCHAR(256) NOT NULL,
    user_customInfo VARCHAR(512) NOT NULL,
    user_fulltime BOOLEAN NULL,
    user_startyear INT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS users OWNER TO admin;

CREATE TABLE IF NOT EXISTS groups
(
    group_id INT GENERATED ALWAYS AS IDENTITY,
    group_owner INT,
    group_name VARCHAR(50) NOT NULL,
    group_subject VARCHAR(30) NOT NULL,
    group_description VARCHAR(512) NULL,
    group_maxMemberCount INT NOT NULL,
    group_creationDate DATE NOT NULL,
    group_applyByDate DATE NOT NULL,
    group_closed BOOLEAN NULL,
    CONSTRAINT fk_owner
      FOREIGN KEY(group_owner)
      REFERENCES users(user_id)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS groups OWNER TO admin;
