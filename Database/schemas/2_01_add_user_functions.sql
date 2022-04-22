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
        start_year INT,
        date_of_registration TIMESTAMP WITH TIME ZONE
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT
            user_id AS id,
            user_name AS name,
            user_surname AS surname,
            user_profile_picture_path AS profile_picture_path,
            user_email AS email,
            user_password_hash AS password_hash,
            user_custom_info AS custom_info,
            user_fulltime AS fulltime,
            user_start_year AS start_year,
            user_date_of_registration AS date_of_registration
        FROM users;
    END
$$;

GRANT ALL ON FUNCTION get_users TO backend;

-- get_user_by_email
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
        start_year INT,
        date_of_registration TIMESTAMP WITH TIME ZONE
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT
            user_id AS id,
            user_name AS name,
            user_surname AS surname,
            user_profile_picture_path AS profile_picture_path,
            user_email AS email,
            user_password_hash AS password_hash,
            user_custom_info AS custom_info,
            user_fulltime AS fulltime,
            user_start_year AS start_year,
            user_date_of_registration AS date_of_registration
         FROM users WHERE user_email = LOWER(p_email);
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
        profile_picture_path VARCHAR,
        date_of_registration TIMESTAMP WITH TIME ZONE
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
            user_profile_picture_path,
            user_date_of_registration;
    END
$$;

GRANT ALL ON FUNCTION edit_user_by_email TO backend;

-- get_unverified_users Function
CREATE OR REPLACE FUNCTION get_unverified_users()
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        password_hash VARCHAR,
        verification_code VARCHAR,
        date_of_registration TIMESTAMP WITH TIME ZONE
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

-- add_unverified_user Function
CREATE OR REPLACE FUNCTION add_unverified_user(
    p_name VARCHAR(30),
    p_surname VARCHAR(30),
    p_email VARCHAR(40),
    p_password_hash VARCHAR(255),
    p_verification_code VARCHAR(50),
    p_date_of_registration TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
    RETURNS TABLE (
        id INT,
        name VARCHAR,
        surname VARCHAR,
        email VARCHAR,
        password_hash VARCHAR,
        verification_code VARCHAR,
        date_of_registration TIMESTAMP WITH TIME ZONE
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
            LOWER(p_email),
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

-- verify and unverified user, turning them into a regular user
CREATE OR REPLACE FUNCTION do_verify_user(
    p_verification_code VARCHAR(50)
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
        start_year INT,
        date_of_registration TIMESTAMP WITH TIME ZONE
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        -- Ensure unverified user can be found.
        IF NOT EXISTS(
            SELECT 1 FROM unverified_users
            WHERE unverified_user_verification_code = p_verification_code
        ) THEN
            RAISE EXCEPTION 'Verification token is not valid.';
        END IF;

        -- Add user
        RETURN QUERY
        WITH unverified_user AS (
            DELETE FROM unverified_users uu
            WHERE unverified_user_verification_code = p_verification_code
            RETURNING uu.*
        )
        INSERT INTO users (
            user_name,
            user_surname,
            user_email,
            user_password_hash,
            user_fulltime,
            user_date_of_registration,
            user_start_year
        )
        SELECT
            unverified_user.unverified_user_name,
            unverified_user.unverified_user_surname,
            unverified_user.unverified_user_email,
            unverified_user.unverified_user_password_hash,
            NULL,
            NOW(),
            NULL
        FROM unverified_user
        LIMIT 1
        RETURNING
            user_id AS id,
            user_name AS name,
            user_surname AS surname,
            user_profile_picture_path AS profile_picture_path,
            user_email AS email,
            user_password_hash AS password_hash,
            user_custom_info AS custom_info,
            user_fulltime AS fulltime,
            user_start_year AS start_year,
            user_date_of_registration AS date_of_registration;
    END
$$;

GRANT ALL ON FUNCTION do_verify_user TO backend;

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
            WHERE user_email = LOWER(p_email)
        )
        OR
        EXISTS(
            SELECT 1 FROM unverified_users
            WHERE unverified_user_email = LOWER(p_email)
        );
    END
$$;

GRANT ALL ON FUNCTION is_email_in_use TO backend;
