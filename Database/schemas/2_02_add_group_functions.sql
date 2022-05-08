-- add Group Function
CREATE OR REPLACE FUNCTION add_group(
    p_name VARCHAR(50),
    p_owner_id INT,
    p_subject_id INT,
    p_description VARCHAR(512),
    p_max_member_count INT,
    p_creation_date TIMESTAMP WITH TIME ZONE,
    p_apply_by_date TIMESTAMP WITH TIME ZONE
)
    RETURNS SETOF groups
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO groups (
            name,
            owner_id,
            subject_id,
            description,
            max_member_count,
            creation_date,
            apply_by_date
        ) VALUES (
            p_name,
            p_owner_id,
            p_subject_id,
            p_description,
            p_max_member_count,
            p_creation_date,
            p_apply_by_date
        )
        RETURNING *;
    END
$$;

GRANT ALL ON FUNCTION add_group TO backend;

-- get Groups Function
CREATE OR REPLACE FUNCTION get_groups()
    RETURNS SETOF groups
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM groups;
    END
$$;

GRANT ALL ON FUNCTION get_groups TO backend;

-- Get Group by id Function
CREATE OR REPLACE FUNCTION get_group_by_id(
    p_group_id INT
)
    RETURNS SETOF groups
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM groups
        WHERE id = p_group_id
        LIMIT 1;
    END
$$;

GRANT ALL ON FUNCTION get_group_by_id TO backend;

-- get groups by Subject ID (have to add part of group filtering)
CREATE OR REPLACE FUNCTION get_groups_by_subject_id(
    p_subject_id INT
)
    RETURNS SETOF groups
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM groups
        WHERE subject_id = p_subject_id;
    END
$$;

GRANT ALL ON FUNCTION get_groups_by_subject_id TO backend;

-- get_members_by_group_id
CREATE OR REPLACE FUNCTION get_members_by_group_id(
    p_group_id INT
)
    RETURNS SETOF users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM users
        WHERE id IN (
            SELECT user_id
            FROM group_memberships
            WHERE group_id = p_group_id
        );
    END
$$;

GRANT ALL ON FUNCTION get_members_by_group_id TO backend;


-- edit_group_by_id
CREATE OR REPLACE FUNCTION edit_group_by_id(
    p_id INT,
    p_name VARCHAR(50),
    p_owner_id INT,
    p_subject_id INT,
    p_description VARCHAR(512),
    p_max_member_count INT,
    p_apply_by_date TIMESTAMP WITH TIME ZONE,
    p_closed BOOLEAN
)
    RETURNS SETOF groups
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        UPDATE groups
        SET name = p_name,
            owner_id = p_owner_id,
            subject_id = p_subject_id,
            description = p_description,
            max_member_count = p_max_member_count,
            apply_by_date = p_apply_by_date,
            closed = p_closed
        WHERE groups.id = p_id
        RETURNING *;
    END
$$;

GRANT ALL ON FUNCTION edit_group_by_id TO backend;
