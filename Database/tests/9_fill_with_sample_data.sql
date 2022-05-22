
--------------------------------------------------------------------------------
--                                 Unit Tests                                 --
-- Ref.: https://stackoverflow.com/questions/11299037/postgresql-if-statement --
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION before_each()
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        -- NOTE: Use direct inserts, not functions, as they are not proven to work at this point.

        -- Add subjects
        INSERT INTO subjects(abbreviation, name) VALUES ('TEST1', 'Use me in tests 1'), ('TEST2', 'Use me in tests 2');
        -- Add users
        INSERT INTO users(name, surname, password_hash, email) VALUES
            ('In', 'Group', '123', 'in.group@ost.ch'),
            ('NotIn', 'Group', '123', 'notin.group@ost.ch'),
            ('John', 'Doe', '123', 'john.doe@ost.ch'),
            ('Jane', 'Mow', '123', 'jane.mow@ost.ch');
        -- Add unverified users
        INSERT INTO unverified_users(name, surname, email, password_hash, verification_code) VALUES
            ('Jaden', 'Doe', 'jaden.doe@ost.ch', '123', 'verifyme1'),
            ('Jargon', 'Mow', 'jargon.mow@ost.ch', '123', 'verifyme2');
        -- Add group
        INSERT INTO groups(owner_id, name, subject_id, max_member_count,creation_date, apply_by_date) VALUES
            (
                (SELECT id FROM users WHERE email = 'in.group@ost.ch'),
                'My first team',
                (SELECT id FROM subjects ORDER BY id DESC LIMIT 1),
                5,
                NOW(),
                NOW() + '3 days'::interval
            );
        INSERT INTO group_memberships(user_id, group_id, member_since) VALUES (
            (SELECT id FROM users WHERE email = 'in.group@ost.ch'),
            (SELECT id FROM groups ORDER BY id DESC LIMIT 1),
            NOW()
        );
    END
$$;

--------------------------------------------------------------------------------
DO
$subject_tests$ BEGIN
    /* Fill with sample data */
    PERFORM before_each();

    ASSERT 1 = COUNT(*) FROM add_subject('NEWSUBJECT', 'Testing subjects'),
        'add_subject failed';

    ASSERT (SELECT COUNT(*) FROM subjects) = COUNT(*) FROM get_subjects(),
        'get_subjects failed';

    ASSERT 1 = COUNT(*) FROM get_subject_by_abbreviation('NEWSUBJECT'),
        'get_subject_by_abbreviation failed';
    ROLLBACK;
END $subject_tests$;
\echo subject_tests passed

--------------------------------------------------------------------------------
DO
$user_tests$ BEGIN
    PERFORM before_each();

    ASSERT 1 = COUNT(*) FROM add_unverified_user('Unverified2', 'User2', 'user1@verified.ch', '545', 'verCode1'),
        'add_unverified_user failed';

    ASSERT is_email_in_use('user1@verified.ch'),
        'is_email_in_use failed';

    ASSERT (SELECT COUNT(*) FROM unverified_users) = COUNT(*) FROM get_unverified_users(),
        'get_unverified_users failed';

    ASSERT 1 = COUNT(*) FROM do_verify_user('verCode1'),
        'do_verify_user failed';

    ASSERT (SELECT COUNT(*) FROM users) = COUNT(*) FROM get_users(),
        'get_users failed';

    ASSERT 1 = COUNT(*) FROM get_user_by_email('user1@verified.ch'),
        'get_user_by_email failed';

    ROLLBACK;
END $user_tests$;
\echo user_tests passed

--------------------------------------------------------------------------------
DO
$group_tests$ BEGIN
    -- Preparation
    PERFORM before_each();
    DELETE FROM groups;

    -- Tests
    ASSERT 1 = COUNT(*) FROM add_group(
            'exampleGroup1',
            (SELECT id FROM users WHERE email = 'notin.group@ost.ch'),
            (SELECT id FROM subjects ORDER BY id DESC LIMIT 1),
            'veryLongDescription',
            5,
            '2012-12-21',
            '2069-4-20'
        ), 'add_group failed';

    ASSERT 1 = COUNT(*) FROM get_group_by_id((SELECT id FROM groups ORDER BY id DESC LIMIT 1)),
        'get_group_by_id failed';

    ASSERT 1 = COUNT(*) FROM get_groups_by_subject_id((SELECT id FROM subjects ORDER BY id DESC LIMIT 1)),
        'get_groups_by_subject_id failed';

    ROLLBACK;
END $group_tests$;
\echo group_tests passed

--------------------------------------------------------------------------------
DO
$group_application_tests$ BEGIN
    -- Preparation
    PERFORM before_each();

    -- Tests
    ASSERT 1 = COUNT(*) FROM add_application(
        (SELECT id FROM users WHERE email = 'notin.group@ost.ch'),
        (SELECT id FROM groups ORDER BY id DESC LIMIT 1),
        'Hi, i want to apply.',
        '2012-12-21'
    ), 'add_group failed';

    ASSERT 1 = COUNT(*) FROM get_applications_to_group(
        (SELECT id FROM groups ORDER BY id DESC LIMIT 1)
    ), 'get_applications_to_group failed';

    ASSERT 0 = COUNT(*) FROM do_close_application(
        (SELECT id FROM group_applications ORDER BY id DESC LIMIT 1),
        FALSE
    ), 'do_close_application failed';

    ASSERT 0 = COUNT(*) FROM get_applications_to_group(
        (SELECT id FROM groups ORDER BY id DESC LIMIT 1)
    ), 'get_applications_to_group failed';

    ROLLBACK;
END $group_application_tests$;
\echo group_application_tests passed

--------------------------------------------------------------------------------
DO
$group_memberships_tests$ BEGIN
    -- Preparation
    PERFORM before_each();
    INSERT INTO group_memberships(user_id, group_id, member_since) VALUES (
        (SELECT id FROM users WHERE email = 'notin.group@ost.ch'),
        (SELECT id FROM groups ORDER BY id DESC LIMIT 1),
        NOW()
    );

    -- Tests
    ASSERT 1 = COUNT(*) FROM get_groups_of_user_by_id(
        (SELECT id FROM users WHERE email = 'notin.group@ost.ch')
    ), 'get_groups_of_user_by_id failed wint regular member';

    ASSERT 1 = COUNT(*) FROM get_groups_of_user_by_id(
        (SELECT id FROM users WHERE email = 'in.group@ost.ch')
    ), 'get_groups_of_user_by_id failed with owner';

    ASSERT 2 = COUNT(*) FROM get_members_by_group_id(
        (SELECT id FROM groups ORDER BY id DESC LIMIT 1)
    ), 'get_members_by_group_id failed';

    ROLLBACK;
END $group_memberships_tests$;
\echo group_memberships_tests passed
