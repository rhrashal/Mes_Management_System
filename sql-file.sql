go
CREATE DATABASE IF NOT EXISTS user;
go
USE user;
go
CREATE TABLE IF NOT EXISTS `users` (
	user_id int(11) NOT NULL AUTO_INCREMENT,
	user_email varchar(50) NOT NULL,
	user_pass varchar(32) NOT NULL,
	user_fname varchar(50) NOT NULL,
	user_nid varchar(50) NULL,
	user_phone varchar(50) NULL,
	user_phone2 varchar(50) NULL,
	user_dob varchar(50) NULL,
	user_userid int(11) NULL,
	user_joindate datetime NULL,
	user_leavedate datetime NULL,
	CONSTRAINT PK_user_id PRIMARY KEY(user_id),
	CONSTRAINT UK_user_email UNIQUE(user_email)
);
go
INSERT INTO users(user_id,user_email,user_pass,user_fname,user_nid,user_phone,user_phone2,user_dob) 
VALUES(1, 'yusufsezer@mail.com', MD5('123456'), 'Yusuf SEZER','ddfsdgds','dsgdsgfsd','dsfgdgd','2001-01-01');
go
select * from users

go
create table meal(
meal_id int(11) NOT NULL AUTO_INCREMENT,
users_id int(11) not null,
meal_date varchar(50) not null,
breakfast int(1) not null,
launch int(1) not null,
dinner int(1) not null,
add_by varchar(110) null,
CONSTRAINT PK_meal_id PRIMARY KEY(meal_id)
)
go