
--------------------------------------------------------------------------------
--                                 Unit Tests                                 --
-- Ref.: https://stackoverflow.com/questions/11299037/postgresql-if-statement --
--------------------------------------------------------------------------------

DO
$subject_tests$ BEGIN
    /* Fill with sample data */
    INSERT INTO subjects(abbreviation, name) VALUES ('DB2', 'Datenbanken 2'), ('CN1', 'Computernetzwerke 1');

    ASSERT 1 = COUNT(*) FROM add_subject('DB1', 'Datenbanken 1'),
        'add_subject failed';

    ASSERT (SELECT COUNT(*) FROM subjects) = COUNT(*) FROM get_subjects(),
        'get_subjects failed';

    ASSERT 1 = COUNT(*) FROM get_subject_by_abbreviation('DB1'),
        'get_subject_by_abbreviation failed';

END $subject_tests$;
\echo subject_tests passed

--------------------------------------------------------------------------------
DO
$user_tests$ BEGIN
    ASSERT 1 = COUNT(*) FROM add_unverified_user('Unverified2', 'User2', 'user1@verified.ch', '545', 'verCode1'),
        'add_unverified_user failed';

    ASSERT is_email_in_use('user1@verified.ch');

    ASSERT (SELECT COUNT(*) FROM unverified_users) = COUNT(*) FROM get_unverified_users(),
        'get_unverified_users failed';

    ASSERT 1 = COUNT(*) FROM do_verify_user('verCode1'),
        'do_verify_user failed';

    ASSERT (SELECT COUNT(*) FROM users) = COUNT(*) FROM get_users(),
        'get_users failed';

    ASSERT 1 = COUNT(*) FROM get_user_by_email('user1@verified.ch'),
        'get_user_by_email failed';

    /* Fill with sample data */
    PERFORM add_unverified_user('Unverified1', 'User2', 'user2@verified.ch', '545', 'verCode2');

END $user_tests$;
\echo user_tests passed

--------------------------------------------------------------------------------
DO
$group_tests$ BEGIN
    ASSERT 1 = COUNT(*) FROM add_group('exampleGroup1', 1, 1, 'veryLongDescription', 5, '2012-12-21', '2069-4-20'),
        'add_group failed';

    ASSERT 1 = COUNT(*) FROM get_group_by_id(1),
        'get_group_by_id failed';

    ASSERT 1 = COUNT(*) FROM get_groups_by_subject_id(1),
        'get_groups_by_subject_id failed';

END $group_tests$;
\echo group_tests passed

--------------------------------------------------------------------------------
DO
$group_application_tests$ BEGIN
    ASSERT 1 = COUNT(*) FROM add_application(1, 1, 'Hi, i want to apply.', '2012-12-21'),
        'add_group failed';

    ASSERT 1 = COUNT(*) FROM get_applications_to_group(1),
        'get_applications_to_group failed';

    ASSERT 0 = COUNT(*) FROM do_close_application(1, FALSE),
        'do_close_application failed';

    ASSERT 0 = COUNT(*) FROM get_applications_to_group(1),
        'get_applications_to_group failed';
END $group_application_tests$;
\echo group_application_tests passed

--------------------------------------------------------------------------------
DO
$group_memberships_tests$ BEGIN
    /* Fill with sample data */
    INSERT INTO group_memberships(user_id, group_id , member_since) VALUES (1, 1, NOW());

    ASSERT 1 = COUNT(*) FROM get_groups_of_user_by_id(1),
        'get_groups_by_user_id failed';

    ASSERT 1 = COUNT(*) FROM get_members_by_group_id(1),
        'get_members_by_group_id failed';

    PERFORM do_remove_user_from_group(1, 1);

END $group_memberships_tests$;
\echo group_memberships_tests passed
