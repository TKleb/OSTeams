
/* ------------------------
    Function Tests
------------------------ */

/* add */
SELECT * FROM add_subject('DB1', 'Datenbanken 1');

SELECT * FROM add_unverifiedUser('Unverified1', 'User', 'user1@unverified.ch', '123', 'verCode', '2012-12-21');

SELECT * FROM add_user('Verified1', 'User', 'user1@verified.ch', '123', 'customInfoText', TRUE, 2020, './default.jpg');

SELECT * FROM add_group('exampleGroup1', 1, 'fuckedATM', 'veryLongDescription', 5, '2012-12-21', '2069-4-20');

/* edit */
SELECT * FROM edit_userByEmail('user1@verified.ch', 'Verified1', 'User', '456', 'newCustomInfoText', TRUE, 2020, './default.jpg');

/* get */
SELECT * FROM get_subjects();
SELECT * FROM get_users();
SELECT * FROM get_unverifiedUsers();
SELECT * FROM get_userByEmail('user1@verified.ch');

/* Fill Up */
INSERT INTO subjects (subject_abbreviation, subject_name)
VALUES ('DB2', 'Datenbanken 2'), ('CN1', 'Computernetzwerke 1');