CREATE TABLE IF NOT EXISTS public.subjects
(
    subject_id INT generated always as identity,
    subject_abbreviation VARCHAR(10) NOT NULL,
    subject_name VARCHAR(30) NOT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.subjects OWNER to admin;

CREATE TABLE IF NOT EXISTS public.unverifiedUsers
(
    unverifiedUser_id INT generated always as identity,
    unverifiedUser_name VARCHAR(30) NOT NULL,
    unverifiedUser_surname VARCHAR(30) NOT NULL,
    unverifiedUser_email VARCHAR(40) NOT NULL,
    unverifiedUser_passwordHashed VARCHAR(255) NOT NULL,
    unverifiedUser_verificationCode VARCHAR(50) NOT NULL,
    unverifiedUser_dateOfRegistration DATE NOT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.unverifiedUsers OWNER to admin;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id INT generated always as identity UNIQUE,
    user_name VARCHAR(30) NOT NULL,
    user_surname VARCHAR(30) NOT NULL,
    user_profilePicturePath VARCHAR(30) NULL,
    user_email VARCHAR(40) NOT NULL,
    user_password VARCHAR(256) NOT NULL,
    user_customInfo VARCHAR(512) NOT NULL,
    user_fulltime BOOLEAN NULL,
    user_startyear INT NULL
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users OWNER to admin;

CREATE TABLE IF NOT EXISTS public.groups
(
    group_id INT generated always as identity,
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
	  REFERENCES public.users(user_id)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.groups OWNER to admin;
