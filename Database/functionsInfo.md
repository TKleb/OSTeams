# Get Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|get_subjects()|-|id, abbrevation, name|returns all subjects in DB|
|get_users()|-|id, name, surname, profile_picture_path, email, password_hash, custom_info, fulltime, start_year|returns all users in DB|
|get_unverified_users()|-|id, name, surname, email, password_hash, verification_code, date_of_registration|returns all unverified_users in DB|
|get_user_by_email()|email|id, name, surname, profile_picture_path, email, password_hash, custom_info, fulltime, start_year|returns user matching the email if nothing matches it returns empty results|

# Is Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|is_email_in_use()|email|boolean|checks whether email is in use by either an unverified or regular user|

# Add Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|add_subject()|abbreviation, name|id, abbreviation, name|adds subject and returns it|
|add_unverified_user()|name, surname, email, password_hash, verification_code, date_of_registration|id, name, surname, email, password_hash, verification_code, date_of_registration|adds unverifiedUser and returns it|
|add_user()|name, surname, email, password_hash, custom_info, fulltime, start_year, profile_picture_path|id, name, surname, email, password_hash, custom_info, fulltime, start_year, profile_picture_path|adds user and returns it|
|add_group()|name, owner_id, subject_id, description, max_member_count, creation_date, apply_by_date|name, owner_id, subject_id, description, max_member_count, creation_date, apply_by_date|adds group and returns it|

# Edit Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|edit_user_by_email()|email, name, surname, password_hash, custom_info, fulltime, start_year, profile_picture_path|id, name, surname, email, password_hash, custom_info, fulltime, start_year, profile_picture_path|updates a User where the Email Matches|

# Do Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|do_verify_user()|verification_token|id, name, surname, email, password_hash, custom_info, fulltime, start_year, profile_picture_path|Verifies the user with the given verification code if it exists, returns the now verified user|

