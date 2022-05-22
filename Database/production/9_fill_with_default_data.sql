--------------------------------------------------------------------------------
--                             Production presets                             --
--------------------------------------------------------------------------------


DO
$add_predefined_subjects$ BEGIN
    PERFORM add_subject('DB1', 'Datenbanken 1');
    PERFORM add_subject('DB2', 'Datenbanken 2');
    PERFORM add_subject('CN1', 'Computernetzwerke 1');
    PERFORM add_subject('CN2', 'Computernetzwerke 2');
END $add_predefined_subjects$;
