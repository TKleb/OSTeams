
--------------------------------------------------------------------------------
--                                 Unit Tests                                 --
-- Ref.: https://stackoverflow.com/questions/11299037/postgresql-if-statement --
--------------------------------------------------------------------------------

DO
$subject_tests$ BEGIN
    IF NOT EXISTS(
        SELECT * FROM add_subject('DB1', 'Datenbanken 1')
    ) THEN
        RAISE EXCEPTION 'add_subject failed';
    END IF;

    IF NOT EXISTS(
        SELECT * FROM get_subjects()
    ) THEN
        RAISE EXCEPTION 'get_subjects failed';
    END IF;

    IF NOT EXISTS(
        SELECT * FROM get_subject_by_abbreviation('DB1')
    ) THEN
        RAISE EXCEPTION 'get_subject_by_abbreviation failed';
    END IF;

    /* Fill with sample data */
    PERFORM add_subject('DB2', 'Datenbanken 2');
    PERFORM add_subject('CN1', 'Computernetzwerke 1');

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
