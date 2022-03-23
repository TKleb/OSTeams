CREATE TABLE IF NOT EXISTS public.subjects
(
    subject_id INT generated by default as identity,
    subject_abbreviation VARCHAR(10) NOT NULL,
    subject_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (subject_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.subjects
    OWNER to admin;