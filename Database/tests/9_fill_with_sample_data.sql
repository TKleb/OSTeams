
/* ------------------------
    Function Tests
------------------------ */

/* add */
\echo add_subject()
SELECT * FROM add_subject('DB1', 'Datenbanken 1');

\echo add_unverified_user()
SELECT * FROM add_unverified_user('Unverified1', 'User', 'user1@unverified.ch', '123', 'verCode');
SELECT * FROM add_unverified_user('Unverified2', 'User2', 'user2@verified.ch', '545', 'verCode2');

\echo do_verify_user()
SELECT * FROM do_verify_user('verCode2');

\echo add_group()
SELECT * FROM add_group('exampleGroup1', 1, 'fuckedATM', 'veryLongDescription', 5, '2012-12-21', '2069-4-20');

/* edit */
\echo edit_user_by_email()
SELECT * FROM edit_user_by_email('user2@verified.ch', 'Verified1', 'User', '456', 'newCustomInfoText', TRUE, 2020, './default.jpg');

/* get */
\echo get_subjects()
SELECT * FROM get_subjects();
\echo get_users()
SELECT * FROM get_users();
\echo get_unverified_users()
SELECT * FROM get_unverified_users();
\echo get_user_by_email()
SELECT * FROM get_user_by_email('user2@verified.ch');

/* Fill Up */
\echo insert into subjects
INSERT INTO subjects (subject_abbreviation, subject_name)
VALUES ('DB2', 'Datenbanken 2'), ('CN1', 'Computernetzwerke 1');
