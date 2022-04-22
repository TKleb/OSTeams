-- get Users Function
CREATE OR REPLACE FUNCTION get_users()
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        profile_picture_path VARCHAR,
        email VARCHAR,
        password_hash VARCHAR,
        custom_info VARCHAR,
        fulltime BOOLEAN,
        start_year INT
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
            user_profile_picture_path,
            user_email,
            user_password_hash,
            user_custom_info,
            user_fulltime,
            user_start_year
        FROM users;
    END
$$;

GRANT ALL ON FUNCTION get_users TO backend;

-- add user function
CREATE OR REPLACE FUNCTION add_user(
    p_name VARCHAR,
    p_surname VARCHAR,
    p_email VARCHAR,
    p_password_hash VARCHAR,
    p_custom_info VARCHAR,
    p_fulltime BOOLEAN,
    p_start_year INT,
    p_profile_picture_path VARCHAR
)
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        password_hash VARCHAR,
        custom_info VARCHAR,
        fulltime BOOLEAN,
        start_year INT,
        profile_picture_path VARCHAR
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
            user_password_hash,
            user_custom_info,
            user_fulltime,
            user_start_year,
            user_profile_picture_path
        ) VALUES (
            p_name,
            p_surname,
            p_email,
            p_password_hash,
            p_custom_info,
            p_fulltime,
            p_start_year,
            p_profile_picture_path
        )
        RETURNING
            user_id,
            user_name,
            user_surname,
            user_email,
            user_password_hash,
            user_custom_info,
            user_fulltime,
            user_start_year,
            user_profile_picture_path;
    END
$$;

GRANT ALL ON FUNCTION add_user TO backend;

-- GetUserByEmail
CREATE OR REPLACE FUNCTION get_user_by_email(
    p_email VARCHAR
)
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        profile_picture_path VARCHAR,
        email VARCHAR,
        password_hash VARCHAR,
        custom_info VARCHAR,
        fulltime BOOLEAN,
        start_year INT
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM users WHERE user_email = p_email;
    END
$$;

GRANT ALL ON FUNCTION get_user_by_email TO backend;

-- edit_user_by_email
CREATE OR REPLACE FUNCTION edit_user_by_email(
    p_email_to_edit VARCHAR,
    p_name VARCHAR,
    p_surname VARCHAR,
    p_password_hash VARCHAR,
    p_custom_info VARCHAR,
    p_fulltime BOOLEAN,
    p_start_year INT,
    p_profile_picture_path VARCHAR
)
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        password_hash VARCHAR,
        custom_info VARCHAR,
        fulltime BOOLEAN,
        start_year INT,
        profile_picture_path VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        UPDATE users
        SET user_name = p_name,
            user_surname = p_surname,
            user_password_hash = p_password_hash,
            user_custom_info = p_custom_info,
            user_fulltime = p_fulltime,
            user_start_year = p_start_year,
            user_profile_picture_path = p_profile_picture_path
        WHERE users.user_email = p_email_to_edit
        RETURNING
            user_id,
            user_name,
            user_surname,
            user_email,
            user_password_hash,
            user_custom_info,
            user_fulltime,
            user_start_year,
            user_profile_picture_path;
    END
$$;

GRANT ALL ON FUNCTION edit_user_by_email TO backend;

-- get unverifiedUser Function
CREATE OR REPLACE FUNCTION get_unverified_users()
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        password_hash VARCHAR,
        verification_code VARCHAR,
        date_of_registration DATE
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT
            unverified_user_id,
            unverified_user_name,
            unverified_user_surname,
            unverified_user_email,
            unverified_user_password_hash,
            unverified_user_verification_code,
            unverified_user_date_of_registration
        FROM unverified_users;
    END
$$;

GRANT ALL ON FUNCTION get_unverified_users TO backend;

-- add unverifiedUser Function
CREATE OR REPLACE FUNCTION add_unverified_user(
    p_name VARCHAR(30),
    p_surname VARCHAR(30),
    p_email VARCHAR(40),
    p_password_hash VARCHAR(255),
    p_verification_code VARCHAR(50),
    p_date_of_registration DATE
)
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        password_hash VARCHAR,
        verification_code VARCHAR,
        date_of_registration DATE
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        IF is_email_in_use(p_email) = TRUE THEN
            RAISE EXCEPTION 'Email already in use.';
        END IF;

        RETURN QUERY
        INSERT INTO unverified_users (
            unverified_user_name,
            unverified_user_surname,
            unverified_user_email,
            unverified_user_password_hash,
            unverified_user_verification_code,
            unverified_user_date_of_registration
        ) VALUES (
            p_name,
            p_surname,
            p_email,
            p_password_hash,
            p_verification_code,
            p_date_of_registration
        )
        RETURNING
            unverified_user_id,
            unverified_user_name,
            unverified_user_surname,
            unverified_user_email,
            unverified_user_password_hash,
            unverified_user_verification_code,
            unverified_user_date_of_registration;
    END
$$;

GRANT ALL ON FUNCTION add_unverified_user TO backend;

-- Add function to check if email is in use by a user or an unverified user
CREATE OR REPLACE FUNCTION is_email_in_use(
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
            SELECT 1 FROM unverified_users
            WHERE unverified_user_email ILIKE p_email
        );
    END
$$;

GRANT ALL ON FUNCTION is_email_in_use TO backend;
