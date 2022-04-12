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
        passwordHash VARCHAR,
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
            user_passwordHash,
            user_customInfo,
            user_fulltime,
            user_startyear
        FROM users;
    END
$$;

GRANT ALL ON FUNCTION get_users TO backend;

-- get unverifiedUser Function
CREATE OR REPLACE FUNCTION get_unverifiedUsers()
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        passwordHash VARCHAR,
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
            unverifiedUser_passwordHash,
            unverifiedUser_verificationCode,
            unverifiedUser_dateOfRegistration
        FROM unverifiedUsers;
    END
$$;

GRANT ALL ON FUNCTION get_unverifiedUsers TO backend;

-- add unverifiedUser Function
CREATE OR REPLACE FUNCTION add_unverifiedUser(
    unverifiedUser_name VARCHAR(30),
    unverifiedUser_surname VARCHAR(30),
    unverifiedUser_email VARCHAR(40),
    unverifiedUser_passwordHash VARCHAR(255),
    unverifiedUser_verificationCode VARCHAR(50),
    unverifiedUser_dateOfRegistration DATE
)
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        passwordHash VARCHAR,
        verificationCode VARCHAR,
        dateOfRegistration DATE
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO unverifiedUsers (
            unverifiedUser_name,
            unverifiedUser_surname,
            unverifiedUser_email,
            unverifiedUser_passwordHash,
            unverifiedUser_verificationCode,
            unverifiedUser_dateOfRegistration
        ) VALUES (
            unverifiedUser_name,
            unverifiedUser_surname,
            unverifiedUser_email,
            unverifiedUser_passwordHash,
            unverifiedUser_verificationCode,
            unverifiedUser_dateOfRegistration
        )
        RETURNING
            unverifiedUsers.unverifiedUser_id,
            unverifiedUsers.unverifiedUser_name,
            unverifiedUsers.unverifiedUser_surname,
            unverifiedUsers.unverifiedUser_email,
            unverifiedUsers.unverifiedUser_passwordHash,
            unverifiedUsers.unverifiedUser_verificationCode,
            unverifiedUsers.unverifiedUser_dateOfRegistration;
    END
$$;

GRANT ALL ON FUNCTION add_unverifiedUser TO backend;

-- add Group Function
CREATE OR REPLACE FUNCTION add_group(
    group_name VARCHAR(50),
    group_owner INT,
    group_subject VARCHAR(30),
    group_description VARCHAR(512),
    group_maxMemberCount INT,
    group_creationDate Date,
    group_applyByDate DATE

)
    RETURNS TABLE (
        name VARCHAR,
        owner INT,
        subject VARCHAR,
        description VARCHAR,
        maxMemberCount INT,
        creationDate DATE,
        applyByDate DATE
    )
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO groups (
            group_name,
            group_owner,
            group_subject,
            group_description,
            group_maxMemberCount,
            group_creationDate,
            group_applyByDate
        ) VALUES (
            group_name,
            group_owner,
            group_subject,
            group_description,
            group_maxMemberCount,
            group_creationDate,
            group_applyByDate
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

GRANT ALL ON FUNCTION add_group TO backend;


---------------------------------------------------------------------
-- add user function
CREATE OR REPLACE FUNCTION add_user(
    user_name VARCHAR,
    user_surname VARCHAR,
    user_email VARCHAR,
    user_passwordHash VARCHAR,
    user_customInfo VARCHAR,
    user_fulltime BOOLEAN,
    user_startyear INT,
    user_profilePicturePath VARCHAR
)
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        passwordHash VARCHAR,
        customInfo VARCHAR,
        fulltime BOOLEAN,
        startyear INT,
        profilePicturePath VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO users (
            user_name,
            user_surname,
            user_email,
            user_passwordHash,
            user_customInfo,
            user_fulltime,
            user_startyear,
            user_profilePicturePath
        ) VALUES (
            user_name,
            user_surname,
            user_email,
            user_passwordHash,
            user_customInfo,
            user_fulltime,
            user_startyear,
            user_profilePicturePath
        )
        RETURNING
            users.user_id,
            users.user_name,
            users.user_surname,
            users.user_email,
            users.user_passwordHash,
            users.user_customInfo,
            users.user_fulltime,
            users.user_startyear,
            users.user_profilePicturePath;
    END
$$;

GRANT ALL ON FUNCTION add_user TO backend;

-- GetUserByEmail
CREATE OR REPLACE FUNCTION get_userByEmail(
    p_email VARCHAR
)
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        profilePicturePath VARCHAR,
        email VARCHAR,
        passwordHash VARCHAR,
        customInfo VARCHAR,
        fulltime BOOLEAN,
        startyear INT
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM users WHERE user_email = p_email;
    END
$$;

GRANT ALL ON FUNCTION get_userByEmail TO backend;

-- edit_userByEmail
CREATE OR REPLACE FUNCTION edit_userByEmail(
    p_emailToEdit VARCHAR,
    p_name VARCHAR,
    p_surname VARCHAR,
    p_passwordHash VARCHAR,
    p_customInfo VARCHAR,
    p_fulltime BOOLEAN,
    p_startyear INT,
    p_profilePicturePath VARCHAR
)
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        passwordHash VARCHAR,
        customInfo VARCHAR,
        fulltime BOOLEAN,
        startyear INT,
        profilePicturePath VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        UPDATE users
        SET user_name = p_name,
            user_surname = p_surname,
            user_passwordHash = p_passwordHash,
            user_customInfo = p_customInfo,
            user_fulltime = p_fulltime,
            user_startyear = p_startyear,
            user_profilePicturePath = p_profilePicturePath
        WHERE users.user_email = p_emailToEdit
        RETURNING
            users.user_id,
            users.user_name,
            users.user_surname,
            users.user_email,
            users.user_passwordHash,
            users.user_customInfo,
            users.user_fulltime,
            users.user_startyear,
            users.user_profilePicturePath;
    END
$$;

GRANT ALL ON FUNCTION edit_userByEmail TO backend;

-- Add function to check if email is in use by a user or an unverified user
CREATE OR REPLACE FUNCTION is_emailInUse(
    p_email VARCHAR
)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN EXISTS(
            SELECT 1 FROM users
            WHERE user_email ILIKE p_email
        )
        OR
        EXISTS(
            SELECT 1 FROM unverifiedUsers
            WHERE unverifiedUser_email ILIKE p_email
        );
    END
$$;

GRANT ALL ON FUNCTION is_emailInUse TO backend;

----------------

-- Open To Implement:
-- isUserTeacher
