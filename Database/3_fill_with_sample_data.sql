/*
SELECT * FROM add_subject('DB1', 'Datenbanken 1');
SELECT * FROM add_subject('DB2', 'Datenbanken 2');
SELECT * FROM add_subject('CN1', 'Computernetzwerke 1');
*/

INSERT INTO subjects (subject_abbreviation, subject_name)
VALUES ('DB1', 'Datenbanken 1'), ('DB2', 'Datenbanken 2'), ('CN1', 'Computernetzwerke 1');

SELECT * FROM add_unverifiedUser('Ronny', 'Mueller', 'ronny.mueller@sure.ch', 'x2fgh3', 'verCode', '2012-12-21');

