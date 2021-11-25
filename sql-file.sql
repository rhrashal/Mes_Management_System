go
CREATE DATABASE IF NOT EXISTS mes_management_system;
go
USE mes_management_system;
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
VALUES(1, 'admin@mail.com', MD5('123456'), 'Admin','','','','');
go
select * from users

go
create table meal(
meal_id int(11) NOT NULL AUTO_INCREMENT,
users_id int(11) not null,
meal_date date not null,
breakfast int(1) not null,
launch int(1) not null,
dinner int(1) not null,
add_by varchar(110) null,
add_date dateTime null,
update_by varchar(110) null,
update_date dateTime null,
status varchar(10) null,
isdelete bool null,
CONSTRAINT PK_meal_id PRIMARY KEY(meal_id)
)
go

select * from meal m where m.meal_id = 1 and month(m.meal_date) = 10

insert into meal(meal_id,users_id,meal_date,breakfast,launch,dinner,add_by)
values (null,2,'2021-11-24',1,1,1,'robiul')


delete from meal where users_id = 2 and month(meal_date) = 11 and year(meal_date) = 2021