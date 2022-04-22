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
    RETURNS TABLE (
        name VARCHAR,
        owner INT,
        subject VARCHAR,
        description VARCHAR,
        max_member_count INT,
        creation_date TIMESTAMP WITH TIME ZONE,
        apply_by_date TIMESTAMP WITH TIME ZONE
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
            group_max_member_count,
            group_creation_date,
            group_apply_by_date
        ) VALUES (
            p_name,
            p_owner,
            p_subject,
            p_description,
            p_max_member_count,
            p_creation_date,
            p_apply_by_date
        )
        RETURNING
            group_name,
            group_owner,
            group_subject,
            group_description,
            group_max_member_count,
            group_creation_date,
            group_apply_by_date;
    END
$$;

GRANT ALL ON FUNCTION add_group TO backend;
