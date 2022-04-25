-- add Group Function
CREATE OR REPLACE FUNCTION add_group(
    p_name VARCHAR(50),
    p_owner INT,
    p_subject VARCHAR(30),
    p_description VARCHAR(512),
    p_max_member_count INT,
    p_creation_date Date,
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
