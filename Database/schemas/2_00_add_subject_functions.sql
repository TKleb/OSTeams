-- Fetch Subject Function
CREATE OR REPLACE FUNCTION get_subjects()
    RETURNS SETOF subjects
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM subjects;
    END
$$;

GRANT ALL ON FUNCTION get_subjects TO backend;

-- Add Subject Function
CREATE OR REPLACE FUNCTION add_subject(
    p_abbreviation VARCHAR,
    p_name VARCHAR
)
    RETURNS SETOF subjects
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO subjects(abbreviation, name)
        VALUES (p_abbreviation, p_name)
        RETURNING *;
    END
$$;

GRANT ALL ON FUNCTION add_subject TO backend;

-- get_subject_by_abbreviation
CREATE OR REPLACE FUNCTION get_subject_by_abbreviation(
    p_abbreviation VARCHAR
)
    RETURNS SETOF subjects
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT *
        FROM subjects WHERE abbreviation = p_abbreviation
        LIMIT 1;
    END
$$;

GRANT ALL ON FUNCTION get_subject_by_abbreviation TO backend;

-- get_subject_by_id
CREATE OR REPLACE FUNCTION get_subject_by_id(
    p_subject_id INT
)
RETURNS SETOF subjects
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT * FROM subjects WHERE id = p_subject_id;
    END
$$;

GRANT ALL ON FUNCTION get_subject_by_id TO backend;
