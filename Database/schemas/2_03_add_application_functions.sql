-- add Group Function
CREATE OR REPLACE FUNCTION add_application(
    p_user_id INT,
    p_group_id INT,
    p_text VARCHAR,
    p_date TIMESTAMP WITH TIME ZONE
)
RETURNS SETOF group_applications
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
        IF is_application_possible(p_user_id, p_group_id) = FALSE THEN
            RAISE EXCEPTION 'User already applied or is a member of the group.';
        END IF;

        RETURN QUERY
        INSERT INTO group_applications (
            user_id,
            group_id,
            text,
            date,
            closed
        ) VALUES (
            p_user_id,
            p_group_id,
            p_text,
            p_date,
            FALSE
        )
        RETURNING *;
    END
$$;

GRANT ALL ON FUNCTION add_application TO backend;

-- Get Group by id Function
CREATE OR REPLACE FUNCTION get_applications_to_group(
    p_group_id INT
)
    RETURNS SETOF group_applications
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM group_applications
        WHERE group_id = p_group_id AND closed = FALSE;
    END
$$;

GRANT ALL ON FUNCTION get_applications_to_group TO backend;

-- verify and unverified user, turning them into a regular user
CREATE OR REPLACE FUNCTION do_close_application(
    p_id INT,
    p_accepted BOOLEAN
)
    RETURNS SETOF group_memberships
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        IF p_accepted = TRUE THEN
            RETURN QUERY
            WITH a AS (
                SELECT user_id, group_id FROM helper_close_application(p_id)
            )
            INSERT INTO group_memberships (
                user_id,
                group_id,
                member_since
            )
            SELECT a.user_id, a.group_id, NOW()
            FROM a
            RETURNING *;
        ELSE
            PERFORM helper_close_application(p_id);
            -- Return an empty row, with the columns organised like a regular membership.
            RETURN QUERY SELECT * FROM group_memberships LIMIT 0;
        END IF;
    END
$$;

GRANT ALL ON FUNCTION do_close_application TO backend;

-- Helper-function to close an application
-- For internal use only
CREATE OR REPLACE FUNCTION helper_close_application(
    p_id int
)
    RETURNS SETOF group_applications
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        UPDATE group_applications
        SET closed = TRUE
        WHERE id = p_id
        RETURNING *;
    END
$$;

-- Add function to check if application is possible.
CREATE OR REPLACE FUNCTION is_application_possible(
    p_user_id INT,
    p_group_id INT
)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN NOT EXISTS(
            -- Existing open application by the user to the group
            SELECT 1 FROM group_applications
            WHERE closed = FALSE
                AND user_id = p_user_id
                AND group_id = p_group_id
        )
        AND
        NOT EXISTS(
            -- Existing membership by the user to the group
            SELECT 1 FROM group_memberships
            WHERE user_id = p_user_id AND group_id = p_group_id
        )
        AND
        (
            -- group not full
            (SELECT max_member_count FROM groups WHERE id = p_group_id LIMIT 1)
            >
            (SELECT COUNT(*) FROM group_memberships WHERE group_id = p_group_id)
        )
        AND
        (
            -- not after apply by date
            (SELECT apply_by_date FROM groups WHERE id = p_group_id LIMIT 1)
            >
            (SELECT CURRENT_TIMESTAMP)
        );
    END
$$;

GRANT ALL ON FUNCTION is_application_possible TO backend;
