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


set @userID := 2, @monthId := 11; 
    select m.meal_id,m.meal_date,m.breakfast,m.launch,m.dinner
	,(select sum(m1.breakfast)/2 from meal m1 where m1.users_id =  @userID and month(m1.meal_date) =  @monthId) as totalBreakfast
	,(select sum(m2.launch) from meal m2 where m2.users_id =  @userID and month(m2.meal_date) =  @monthId) as totalLaunch
	,(select sum(m3.dinner) from meal m3 where m3.users_id =  @userID and month(m3.meal_date) =  @monthId)  as totalDinner 
	,(select (sum(m4.breakfast)/2)+sum(m4.launch)+sum(m4.dinner) from meal m4 where m4.users_id =  @userID and month(m4.meal_date) =  @monthId)  as totalMeal 
	from meal m where m.users_id =  @userID and month(m.meal_date) =  @monthId
	


set @DateFilter := '2021-11-25'; 
    select  u.user_id ,u.user_fname,m.meal_id,m.meal_date,m.breakfast,m.launch,m.dinner
	,(select sum(m1.breakfast) from meal m1 where m1.meal_date =  @DateFilter ) as totalBreakfast
	,(select sum(m2.launch) from meal m2 where m2.meal_date =  @DateFilter ) as totalLaunch
	,(select sum(m3.dinner) from meal m3 where m3.meal_date =  @DateFilter )  as totalDinner 
	,(select (sum(m4.breakfast)/2)+sum(m4.launch)+sum(m4.dinner) from meal m4 where m4.meal_date =  @DateFilter )  as totalMeal 
	from meal m inner join users u on u.user_id  = m.users_id 
	where m.meal_date =  @DateFilter





	

SELECT u.user_id,u.user_email,u.user_fname,u.user_phone
,(select (sum(m2.breakfast)+sum(m2.launch)+sum(m2.dinner))  from meal m2 where m2.users_id =u.user_id and  month(m2.meal_date) = month(curdate()) and  year(m2.meal_date) = year(curdate())  and m2.meal_date<=curdate() ) as total_meal 
FROM users u where u.user_fname<>'Admin' order by u.user_fname
                 
-- --u.user_fname<>'Admin' order by u.user_fname

select * from users u m where  month (m.meal_date) = month(curdate())  and m.meal_date<=curdate()