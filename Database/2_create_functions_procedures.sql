CREATE OR REPLACE FUNCTION public.get_subjects()
	RETURNS TABLE (
		id int,
		abbreviation VARCHAR,
		name VARCHAR
	)
	LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
	RETURN QUERY
  SELECT subject_id, subject_abbreviation, subject_name FROM public."subjects";
END
$$;

GRANT ALL ON FUNCTION public.get_subjects to backend;