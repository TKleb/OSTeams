
/* ------------------------
    Function Tests
------------------------ */

/* add */
\echo add_subject()
SELECT * FROM add_subject('DB1', 'Datenbanken 1');

\echo add_unverified_user()
SELECT * FROM add_unverified_user('Unverified1', 'User', 'user1@unverified.ch', '123', 'verCode', '2012-12-21');

\echo add_user()
SELECT * FROM add_user('Verified1', 'User', 'user1@verified.ch', '123', 'custom_infoText', TRUE, 2020, './default.jpg');

\echo add_group()
SELECT * FROM add_group('exampleGroup1', 1, 'fuckedATM', 'veryLongDescription', 5, '2012-12-21', '2069-4-20');

/* edit */
\echo edit_user_by_email()
SELECT * FROM edit_user_by_email('user1@verified.ch', 'Verified1', 'User', '456', 'newCustomInfoText', TRUE, 2020, './default.jpg');

/* get */
\echo get_subjects()
SELECT * FROM get_subjects();
\echo get_users()
SELECT * FROM get_users();
\echo get_unverified_users()
SELECT * FROM get_unverified_users();
\echo get_user_by_email()
SELECT * FROM get_user_by_email('user1@verified.ch');

/* Fill Up */
\echo insert into subjects
INSERT INTO subjects (subject_abbreviation, subject_name)
VALUES ('DB2', 'Datenbanken 2'), ('CN1', 'Computernetzwerke 1');