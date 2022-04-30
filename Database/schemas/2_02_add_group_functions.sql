-- add Group Function
CREATE OR REPLACE FUNCTION add_group(
    p_name VARCHAR(50),
    p_owner INT,
    p_subject INT,
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
            owner,
            subject,
            description,
            max_member_count,
            creation_date,
            apply_by_date
        ) VALUES (
            p_name,
            p_owner,
            p_subject,
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
    p_id INT
)
    RETURNS SETOF groups
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM groups WHERE id = p_id;
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
        SELECT * FROM groups WHERE subject = p_subject_id;
    END
$$;

GRANT ALL ON FUNCTION get_groups_by_subject_id TO backend;
