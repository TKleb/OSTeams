
--------------------------------------------------------------------------------
--                                 Unit Tests                                 --
-- Ref.: https://stackoverflow.com/questions/11299037/postgresql-if-statement --
--------------------------------------------------------------------------------


CREATE OR REPLACE FUNCTION assert_count(
    p_expected_count BIGINT,
    p_query VARCHAR,
    p_args VARCHAR
)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    DECLARE correct BOOLEAN;
    BEGIN
        EXECUTE FORMAT('SELECT COUNT(*) = %1$s FROM %2$s(', p_expected_count, p_query)
                || REPLACE(p_args, '"', '''')
                || ')'
            INTO correct;
        IF NOT correct THEN
            RAISE 'Failed: %', p_query;
        END IF;
        RETURN correct;
    END
$$;

DO
$subject_tests$ BEGIN
    /* Fill with sample data */
    INSERT INTO subjects(abbreviation, name) VALUES ('DB2', 'Datenbanken 2'), ('CN1', 'Computernetzwerke 1');

    ASSERT assert_count(1, 'add_subject', '"DB1", "Datenbanken 1"');

    ASSERT assert_count((SELECT COUNT(*) FROM subjects), 'get_subjects', ' ');

    ASSERT assert_count(1, 'get_subject_by_abbreviation', '"DB1"');

END $subject_tests$;
\echo subject_tests passed

--------------------------------------------------------------------------------
DO
$user_tests$ BEGIN
    IF NOT EXISTS(
        SELECT * FROM add_unverified_user('Unverified2', 'User2', 'user1@verified.ch', '545', 'verCode1')
    ) THEN
        RAISE EXCEPTION 'add_unverified_user failed';
    END IF;

    IF NOT EXISTS(
        SELECT * FROM get_unverified_users()
    ) THEN
        RAISE EXCEPTION 'get_unverified_users failed';
    END IF;

    IF NOT EXISTS(
        SELECT * FROM do_verify_user('verCode1')
    )
    THEN
        RAISE EXCEPTION 'do_verify_user failed';
    END IF;

    IF NOT EXISTS(
        SELECT * FROM get_users()
    )
    THEN
        RAISE EXCEPTION 'get_users failed';
    END IF;

    IF NOT EXISTS(
        SELECT * FROM get_user_by_email('user1@verified.ch')
    )
    THEN
        RAISE EXCEPTION 'get_user_by_email failed';
    END IF;

    /* Fill with sample data */
    PERFORM add_unverified_user('Unverified1', 'User2', 'user2@verified.ch', '545', 'verCode2');

END $user_tests$;
\echo user_tests passed

--------------------------------------------------------------------------------
DO
$group_tests$ BEGIN
    IF NOT EXISTS(
        SELECT * FROM add_group('exampleGroup1', 1, 'fuckedATM', 'veryLongDescription', 5, '2012-12-21', '2069-4-20')
    ) THEN
        RAISE EXCEPTION 'add_group failed';
    END IF;
END $group_tests$;
\echo group_tests passed
