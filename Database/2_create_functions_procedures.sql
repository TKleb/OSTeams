-- Fetch Subject Function
CREATE OR REPLACE FUNCTION get_subjects()
    RETURNS TABLE (
        id INT,
        abbreviation VARCHAR,
        name VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT
            subject_id,
            subject_abbreviation,
            subject_name
        FROM subjects;
    END
$$;

GRANT ALL ON FUNCTION get_subjects TO backend;

-- Add Subject Function
CREATE OR REPLACE FUNCTION add_subject(subject_abbreviation VARCHAR, subject_name VARCHAR)
    RETURNS TABLE (
        id INT,
        abbreviation VARCHAR,
        name VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO
            subjects(subject_abbreviation, subject_name)
        VALUES (subject_abbreviation, subject_name)
        RETURNING subjects.subject_id, subjects.subject_abbreviation, subjects.subject_name;
    END
$$;

GRANT ALL ON FUNCTION add_subject TO backend;

-- get Users Function
CREATE OR REPLACE FUNCTION get_users()
	RETURNS TABLE (
		id INT,
		name VARCHAR,
		surname VARCHAR,
		profilePicturePath VARCHAR,
		email VARCHAR,
		password VARCHAR,
		customInfo VARCHAR,
		fulltime BOOLEAN,
		startyear INT
	)
	LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
	    RETURN QUERY
        SELECT
            user_id,
            user_name,
            user_surname,
            user_profilePicturePath,
            user_email,
            user_password,
            user_customInfo,
            user_fulltime,
            user_startyear
        FROM users;
    END
$$;

GRANT ALL ON FUNCTION get_users to backend;

-- get unverifiedUser Function
CREATE OR REPLACE FUNCTION get_unverifiedUsers()
	RETURNS TABLE (
		id INT,
		name VARCHAR,
		surname VARCHAR,
		email VARCHAR,
		password VARCHAR,
		verificationCode VARCHAR,
		dateOfRegistration DATE
	)
	LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT
            unverifiedUser_id,
            unverifiedUser_name,
            unverifiedUser_surname,
            unverifiedUser_email,
            unverifiedUser_passwordHashed,
            unverifiedUser_verificationCode,
            unverifiedUser_dateOfRegistration
        FROM unverifiedUsers;
    END
$$;

GRANT ALL ON FUNCTION get_unverifiedUsers to backend;

-- add unverifiedUser Function
CREATE OR REPLACE FUNCTION add_unverifiedUser(
    name VARCHAR(30),
    surname VARCHAR(30),
    email VARCHAR(40),
    passwordHashed VARCHAR(255),
    verificationCode VARCHAR(50),
    dateOfRegistration DATE
) RETURNS QUERY AS
$$
    BEGIN
        INSERT INTO unverifiedUsers (
            unverifiedUser_name,
            unverifiedUser_surname,
            unverifiedUser_email,
            unverifiedUser_passwordHashed,
            unverifiedUser_verificationCode,
            unverifiedUser_dateOfRegistration
        ) VALUES (
            name,
            surname,
            email,
            passwordHashed,
            verificationCode,
            dateOfRegistration
        )
        RETURNING
            unverifiedUsers.unverifiedUser_id,
            unverifiedUsers.unverifiedUser_name,
            unverifiedUsers.unverifiedUser_surname,
            unverifiedUsers.unverifiedUser_email,
            unverifiedUsers.unverifiedUser_passwordHashed,
            unverifiedUsers.unverifiedUser_verificationCode,
            unverifiedUsers.unverifiedUser_dateOfRegistration;
    END
$$;

GRANT ALL ON FUNCTION add_unverifiedUser to backend;

-- add Group Function
CREATE OR REPLACE FUNCTION add_group(
    name VARCHAR(50),
	owner INT,
    subject VARCHAR(30),
    description VARCHAR(512),
    maxMemberCount INT,
    creationDate Date,
    applyByDate DATE
) RETURNS QUERY AS
$$
    BEGIN
        INSERT INTO groups (
            group_name,
            group_owner,
            group_subject,
            group_description,
            group_maxMemberCount,
            group_creationDate,
            group_applyByDate
        ) VALUES (
            name,
            owner,
            subject,
            description,
            maxMemberCount,
            creationDate,
            applyByDate
        )
        RETURNING
            groups.group_name,
            groups.group_owner,
            groups.group_subject,
            groups.group_description,
            groups.group_maxMemberCount,
            groups.group_creationDate,
            groups.group_applyByDate;
    END
$$;

GRANT ALL ON FUNCTION add_group to backend;
