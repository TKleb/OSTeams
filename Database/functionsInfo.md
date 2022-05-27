# Return types
| Name             | Columns                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Subject          | id, abbreviation, name                                                                                                 |
| UnverifiedUser   | id, name, surname, email, password_hash, verification_code, date_of_registration                                       |
| User             | id, name, surname, profile_picture_path, email, password_hash, custom_info, fulltime, start_year, date_of_registration |
| Group            | id, owner, name, subject_id, description, max_member_count, creation_date, apply_by_date, closed                       |
| GroupApplication | id, user_id, group_id, text, date, closed                                                                              |
| GroupMembership  | id, user_id, group_id, member_since                                                                                    |

# Get Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|get_subjects()|-|Subject[0..n] |Returns all subjects in DB|
|get_subject_by_abbreviation()|abbreviation|Subject[0..1] |Returns subject|
|get_subject_by_id()|id|Subject[0..1] |Returns subject|
|get_users()|-| User[0..n] |Returns all users in DB|
|get_unverified_users()|-| UnverifiedUser[0..n] |Returns all unverified_users in DB|
|get_user_by_id()|id| User[0..1] |Returns user matching the id if nothing matches it returns empty results|
|get_user_by_email()|email| User[0..1] |Returns user matching the email if nothing matches it returns empty results|
|get_groups()| - | Group[0..n] |Returns all groups|
|get_group_by_id()| group_id | Group[0..1] |Returns group|
|get_groups_of_user_by_id()|user_id| Group[0..n] |Returns all the groups the user is a member of|
|get_groups_by_subject_id()|subject_id| Group[0..n] |Returns all the groups associated with the given subject|
|get_members_by_group_id()|group_id| User[0..n] |Returns all members of the group. If group does not exist, returns an empty list.|
|get_applications_to_group()|group_id| GroupApplication[0..n] |Returns all open applications to the group.|

# Is Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|is_email_in_use()|email|boolean|checks whether email is in use by either an unverified or regular user|

# Add Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|add_subject()|abbreviation, name| Subject[0..1] |adds subject and returns it|
|add_unverified_user()|name, surname, email, password_hash, verification_code, date_of_registration| UnverifiedUser[0..1] |adds unverifiedUser and returns it|
|add_user()|name, surname, email, password_hash, custom_info, fulltime, start_year, profile_picture_path| User[0..1] |adds user and returns it|
|add_group()|name, owner_id, subject_id, description, max_member_count, creation_date, apply_by_date| Group[0..1] |adds group and returns it|
|add_application()|user_id, group_id, text, timestamp| GroupApplication[1] |Adds a new group-application|

# Edit Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|edit_user_by_email()|email, name, surname, password_hash, custom_info, fulltime, start_year, profile_picture_path| User[0..1] |updates a User where the Email Matches|

# Do Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|do_verify_user()|verification_token| User[0..1] |Verifies the user with the given verification code if it exists, returns the now verified user|
|do_remove_user_from_group()|user_id, group_id| - |Kicks the user from the group if present|
|do_close_application()|application_id, accepted| GroupMembership[0..1] |Closes the application. If `accepted`, a GroupMembership is created.|
|do_remove_group_by_id()|group_id| Boolean |Deletes group where id = group_id|
|do_remove_user_by_id()|user_id| Boolean |Deletes the user where id = user_id|
