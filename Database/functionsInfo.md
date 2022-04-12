# Get Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|get_subjects()|-|id, abbrevation, name|returns all subjects in DB|
|get_users()|-|id, name, surname, profilepicturepath, email, passwordhash, custominfo, fulltime, startyear|returns all users in DB|
|get_unverifiedUsers()|-|id, name, surname, email, passwordhash, verificationcode, dateofregistration|returns all unverifiedUsers in DB|
|get_userByEmail()|email|id, name, surname, profilepicturepath, email, passwordhash, custominfo, fulltime, startyear|returns user matching the email if nothing matches it returns empty results|

# Add Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|add_subject()|abbrevation, name|id, abbrevation, name|adds subject and returns it|
|add_unverifiedUser()|name, surname, email, passwordhash, verificationcode, dateofregistration|id, name, surname, email, passwordhash, verificationcode, dateofregistration|adds unverifiedUser and returns it|
|add_user()|name, surname, email, passwordhash, custominfo, fulltime, startyear, profilepicturepath|id, name, surname, email, passwordhash, custominfo, fulltime, startyear, profilepicturepath|adds user and returns it|
|add_group()|name, owner, subject, description, maxmembercount, creationdate, applybydate|name, owner (int (key)), subject (varchar (aktuell fucked und nid fk)), description, maxMemberCount, creationdate, applybydate|adds group and returns it|

# Edit Functions
| Name | Parameter | Returns | Description |
|---|---|---|---|
|edit_userByEmail()|email, name, surname, passwordHash, customInfo, fulltime, startyear, profilePicturePath|id, name, surname, email, passwordhash, customInfo, fulltime, startyear, profilePicturePath|updates a User where the Email Matches|

