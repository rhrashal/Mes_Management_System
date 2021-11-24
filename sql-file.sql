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
INSERT INTO users(user_id,user_email,user_pass,user_fname) VALUES(1, 'yusufsezer@mail.com', MD5('123456'), 'Yusuf SEZER');
go
select * from users

