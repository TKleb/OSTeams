-- get Users Function
CREATE OR REPLACE FUNCTION get_users()
    RETURNS SETOF users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM users;
    END
$$;

GRANT ALL ON FUNCTION get_users TO backend;

-- get_user_by_email
CREATE OR REPLACE FUNCTION get_user_by_email(
    p_email VARCHAR
)
    RETURNS SETOF users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM users
        WHERE email = LOWER(p_email)
        LIMIT 1;
    END
$$;

GRANT ALL ON FUNCTION get_user_by_email TO backend;

-- edit_user_by_email
CREATE OR REPLACE FUNCTION edit_user_by_id(
    p_id INT,
    p_name VARCHAR,
    p_surname VARCHAR,
    p_custom_info VARCHAR,
    p_fulltime BOOLEAN,
    p_start_year INT
)
    RETURNS SETOF users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        UPDATE users
        SET name = p_name,
            surname = p_surname,
            custom_info = p_custom_info,
            fulltime = p_fulltime,
            start_year = p_start_year
        WHERE users.id = p_id
        RETURNING *;
    END
$$;

GRANT ALL ON FUNCTION edit_user_by_id TO backend;

-- get_unverified_users Function
CREATE OR REPLACE FUNCTION get_unverified_users()
    RETURNS SETOF unverified_users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM unverified_users;
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
    RETURNS SETOF unverified_users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        IF is_email_in_use(p_email) = TRUE THEN
            RAISE EXCEPTION 'Email already in use.';
        END IF;

        RETURN QUERY
        INSERT INTO unverified_users (
            name,
            surname,
            email,
            password_hash,
            verification_code,
            date_of_registration
        ) VALUES (
            p_name,
            p_surname,
            LOWER(p_email),
            p_password_hash,
            p_verification_code,
            p_date_of_registration
        )
        RETURNING *;
    END
$$;

GRANT ALL ON FUNCTION add_unverified_user TO backend;

-- verify and unverified user, turning them into a regular user
CREATE OR REPLACE FUNCTION do_verify_user(
    p_verification_code VARCHAR(50)
)
    RETURNS SETOF users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        -- Ensure unverified user can be found.
        IF NOT EXISTS(
            SELECT 1 FROM unverified_users
            WHERE verification_code = p_verification_code
        ) THEN
            RAISE EXCEPTION 'Verification token is not valid.';
        END IF;

        -- Add user
        RETURN QUERY
        WITH unverified_user AS (
            DELETE FROM unverified_users uu
            WHERE verification_code = p_verification_code
            RETURNING uu.*
        )
        INSERT INTO users (
            name,
            surname,
            email,
            password_hash,
            fulltime,
            date_of_registration,
            start_year
        )
        SELECT
            unverified_user.name,
            unverified_user.surname,
            unverified_user.email,
            unverified_user.password_hash,
            NULL,
            NOW(),
            NULL
        FROM unverified_user
        LIMIT 1
        RETURNING *;
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
            WHERE email = LOWER(p_email)
        )
        OR
        EXISTS(
            SELECT 1 FROM unverified_users
            WHERE email = LOWER(p_email)
        );
    END
$$;

GRANT ALL ON FUNCTION is_email_in_use TO backend;

-- do_remove_user_from_group
CREATE OR REPLACE FUNCTION do_remove_user_from_group(
    p_user_id INT,
    p_group_id INT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
        DELETE FROM group_memberships
        WHERE user_id = p_user_id AND group_id = p_group_id;
    END
$$;

GRANT ALL ON FUNCTION do_remove_user_from_group TO backend;

-- get_groups_of_user_by_id
CREATE OR REPLACE FUNCTION get_groups_of_user_by_id(
    p_user_id INT
)
RETURNS SETOF groups
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM groups WHERE id IN (
            SELECT group_id FROM group_memberships WHERE user_id = p_user_id
        );
    END
$$;

GRANT ALL ON FUNCTION get_groups_of_user_by_id TO backend;

-- get_user_by_id
CREATE OR REPLACE FUNCTION get_user_by_id(
    p_user_id INT
)
RETURNS SETOF users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM users WHERE id = p_user_id;
    END
$$;

GRANT ALL ON FUNCTION get_user_by_id TO backend;

-- do_remove_user_by_id
CREATE OR REPLACE FUNCTION do_remove_user_by_id(
    p_user_id INT
)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
	DECLARE
		count INT;
    BEGIN
		WITH deletedRows AS (
			DELETE FROM users WHERE id = p_user_id RETURNING *
		)
		SELECT COUNT(*) FROM deletedRows INTO count;
		RETURN 0 < count;
    END
$$;

GRANT ALL ON FUNCTION do_remove_user_by_id TO backend;
