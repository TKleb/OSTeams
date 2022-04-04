CREATE OR REPLACE FUNCTION public.get_subjects()
	RETURNS TABLE (
		id INT,
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

CREATE OR REPLACE FUNCTION public.get_userData()
	RETURNS TABLE (
		id INT,
		name VARCHAR,
		surname VARCHAR,
		profilePicturePath VARCHAR,
		email VARCHAR,
		password VARCHAR,
		customInfo VARCHAR,
		fulltime BOOLEAN,
		startyear INT
	)
	LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
	RETURN QUERY
  SELECT user_id, user_name, user_surname, user_profilePicturePath, user_email, user_password, user_customInfo, user_fulltime, user_startyear FROM public."user";
END
$$;

GRANT ALL ON FUNCTION public.get_userData to backend;

CREATE OR REPLACE FUNCTION public.get_unverifiedUserData()
	RETURNS TABLE (
		id INT,
		name VARCHAR,
		surname VARCHAR,
		email VARCHAR,
		password VARCHAR,
		verificationCode VARCHAR,
		dateOfRegristration DATE
	)
	LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
	RETURN QUERY
  SELECT unverfiedUser_id, unverifiedUser_name, unverifiedUser_surname, unverifiedUser_email, unverifiedUser_passwordHashed, unverifiedUser_verificationCode, unverifiedUser_dateOfRegristration FROM public."unverifiedUser";
END
$$;

GRANT ALL ON FUNCTION public.get_unverifiedUserData to backend;

CREATE OR REPLACE FUNCTION public.create_unverifiedUser(
    name VARCHAR(30),
    surname VARCHAR(30),
    email VARCHAR(40),
    passwordHashed VARCHAR(255),
    verificationCode VARCHAR(50),
    dateOfRegristration DATE
) RETURNS void AS
$$
BEGIN
	INSERT INTO unverifiedUser (
		unverifiedUser_name, 
		unverifiedUser_surname,
		unverifiedUser_email,
		unverifiedUser_passwordHashed,
		unverifiedUser_verificationCode,
		unverifiedUser_dateOfRegristration
	) VALUES (
		name, 
		surname, 
		email, 
		passwordHashed, 
		verificationCode, 
		dateOfRegristration
	);
END
$$
	LANGUAGE 'plpgsql';

GRANT ALL ON FUNCTION public.create_unverifiedUser to backend;

-- Create Group
CREATE OR REPLACE FUNCTION public.create_group(
    name VARCHAR(50),
	owner INT,
    subject VARCHAR(30),
    description VARCHAR(512),
    maxMemberCount INT,
    creationDate Date,
    applyByDate DATE
) RETURNS void AS
$$
BEGIN
	INSERT INTO public.group (
		group_name, 
		group_owner,
		group_subject,
		group_description,
		group_maxMemberCount,
		group_creationDate,
		group_applyByDate
	) VALUES (
		name,
		owner,
		subject, 
		description, 
		maxMemberCount, 
		creationDate, 
		applyByDate
	);
END
$$
	LANGUAGE 'plpgsql';

GRANT ALL ON FUNCTION public.create_group to backend;
