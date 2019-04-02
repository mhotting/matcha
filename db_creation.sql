/*
    DATABASE creation
    Matcha Project
    krambono - mhotting
    2019
*/

/* ************************************************************ */
-- Database creations
/* ************************************************************ */
CREATE SCHEMA `db_matcha` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `db_matcha`;


/* ************************************************************ */
-- Table creations
/* ************************************************************ */

-- t_user
CREATE TABLE `db_matcha`.`t_user` (
  `usr_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usr_fname` VARCHAR(255) NOT NULL,
  `usr_lname` VARCHAR(255) NOT NULL,
  `usr_birthDate` DATE NOT NULL,
  `usr_email` VARCHAR(255) NOT NULL,
  `usr_pwd` VARCHAR(255) NOT NULL,
  `usr_age` INT NOT NULL,
  `usr_gender` VARCHAR(1) NOT NULL,
  `usr_bio` TEXT NULL,
  `usr_score` INT NOT NULL DEFAULT 0,
  `usr_status` VARCHAR(255) NULL,
  `usr_location` VARCHAR(255) NULL,
  `usr_creationDate` DATETIME NOT NULL DEFAULT NOW(),
  `usr_connectionDate` DATETIME NULL,
  `usr_activationToken` VARCHAR(255) NOT NULL,
  `usr_pwdToken` VARCHAR(255) NOT NULL,
  `usr_idOrientation` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`usr_id`),
  UNIQUE INDEX `usr_id_UNIQUE` (`usr_id` ASC)
  )
  ENGINE=InnoDB;

-- t_message
CREATE TABLE `db_matcha`.`t_message` (
  `msg_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `msg_content` TEXT NULL,
  `msg_creationDate` DATETIME NOT NULL DEFAULT NOW(),
  `msg_idSender` INT UNSIGNED NOT NULL,
  `msg_idReceiver` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`msg_id`),
  UNIQUE INDEX `msg_id_UNIQUE` (`msg_id` ASC)
  )
  ENGINE=InnoDB;

-- t_image
CREATE TABLE `db_matcha`.`t_image` (
  `image_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `image_path` VARCHAR(255) NOT NULL,
  `image_idUser` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`image_id`),
  UNIQUE INDEX `image_id_UNIQUE` (`image_id` ASC)
  )
  ENGINE=InnoDB;

-- t_orientation
CREATE TABLE `db_matcha`.`t_orientation` (
  `orientation_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `orientation_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`orientation_id`),
  UNIQUE INDEX `orientation_id_UNIQUE` (`orientation_id` ASC),
  UNIQUE INDEX `orientation_name_UNIQUE` (`orientation_name` ASC)
  )
  ENGINE=InnoDB;

-- t_interest
CREATE TABLE `db_matcha`.`t_interest` (
  `interest_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `interest_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`interest_id`),
  UNIQUE INDEX `interest_id_UNIQUE` (`interest_id` ASC),
  UNIQUE INDEX `interest_name_UNIQUE` (`interest_name` ASC)
  )
  ENGINE=InnoDB;

-- t_notif
CREATE TABLE `db_matcha`.`t_notification` (
  `notif_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `notif_creationDate` DATETIME NOT NULL DEFAULT NOW(),
  `notif_consulted` TINYINT NOT NULL DEFAULT 0,
  `notif_category` VARCHAR(45) NOT NULL,
  `notif_idUser` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`notif_id`),
  UNIQUE INDEX `notif_id_UNIQUE` (`notif_id` ASC)
  )
  ENGINE=InnoDB;

-- t_userInterest
CREATE TABLE `db_matcha`.`t_userInterest` (
  `userInterest_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userInterest_idUser` INT UNSIGNED NOT NULL,
  `userInterest_idInterest` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`userInterest_id`),
  UNIQUE INDEX `userInterest_id_UNIQUE` (`userInterest_id` ASC)
  )
  ENGINE=InnoDB;

-- t_visit
CREATE TABLE `db_matcha`.`t_visit` (
  `visit_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `visit_idVisitor` INT UNSIGNED NOT NULL,
  `visit_idVisited` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`visit_id`),
  UNIQUE INDEX `visit_id_UNIQUE` (`visit_id` ASC)
  )
  ENGINE=InnoDB;

-- t_dislike
CREATE TABLE `db_matcha`.`t_dislike` (
  `dislike_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dislike_idDisliked` INT UNSIGNED NOT NULL,
  `dislike_idDisliker` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`dislike_id`),
  UNIQUE INDEX `dislike_id_UNIQUE` (`dislike_id` ASC)
  )
  ENGINE=InnoDB;

-- t_like
CREATE TABLE `db_matcha`.`t_like` (
  `like_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `like_idLiked` INT UNSIGNED NOT NULL,
  `like_idLiker` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`like_id`),
  UNIQUE INDEX `like_id_UNIQUE` (`like_id` ASC)
  )
  ENGINE=InnoDB;

-- t_block
CREATE TABLE `db_matcha`.`t_block` (
  `block_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_idBlocked` INT UNSIGNED NOT NULL,
  `block_idBlocker` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`block_id`),
  UNIQUE INDEX `block_id_UNIQUE` (`block_id` ASC)
  )
  ENGINE=InnoDB;

-- t_signal
CREATE TABLE `db_matcha`.`t_signal` (
  `signal_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `signal_idSignaled` INT UNSIGNED NOT NULL,
  `signal_idSignalor` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`signal_id`),
  UNIQUE INDEX `signal_id_UNIQUE` (`signal_id` ASC)
  )
  ENGINE=InnoDB;


/* ************************************************************ */
-- ADDING THE FOREIGN KEY CONSTRAINTS
/* ************************************************************ */

-- t_user
ALTER TABLE `db_matcha`.`t_user`
ADD CONSTRAINT FK_UserOrientation
FOREIGN KEY (`usr_idOrientation`) REFERENCES `db_matcha`.`t_orientation`(orientation_id);

-- t_image
ALTER TABLE `db_matcha`.`t_image`
ADD CONSTRAINT FK_ImageUser
FOREIGN KEY (`image_idUser`) REFERENCES `db_matcha`.`t_user`(usr_id);

-- t_message
ALTER TABLE `db_matcha`.`t_message`
ADD CONSTRAINT FK_MessageSender
FOREIGN KEY (`msg_idSender`) REFERENCES `db_matcha`.`t_user`(usr_id);
ALTER TABLE `db_matcha`.`t_message`
ADD CONSTRAINT FK_MessageReceiver
FOREIGN KEY (`msg_idReceiver`) REFERENCES `db_matcha`.`t_user`(usr_id);

-- t_userInterest
ALTER TABLE `db_matcha`.`t_userInterest`
ADD CONSTRAINT FK_InterestUser
FOREIGN KEY (`userInterest_idUser`) REFERENCES `db_matcha`.`t_user`(usr_id);
ALTER TABLE `db_matcha`.`t_userInterest`
ADD CONSTRAINT FK_UserInterest
FOREIGN KEY (`userInterest_idInterest`) REFERENCES `db_matcha`.`t_interest`(interest_id);

-- t_notif
ALTER TABLE `db_matcha`.`t_notification`
ADD CONSTRAINT FK_notifUser
FOREIGN KEY (`notif_idUser`) REFERENCES `db_matcha`.`t_user`(usr_id);

-- t_visit
ALTER TABLE `db_matcha`.`t_visit`
ADD CONSTRAINT FK_Visitor
FOREIGN KEY (`visit_idVisitor`) REFERENCES `db_matcha`.`t_user`(usr_id);
ALTER TABLE `db_matcha`.`t_visit`
ADD CONSTRAINT FK_Visited
FOREIGN KEY (`visit_idVisited`) REFERENCES `db_matcha`.`t_user`(usr_id);

-- t_dislike
ALTER TABLE `db_matcha`.`t_dislike`
ADD CONSTRAINT FK_Disliker
FOREIGN KEY (`dislike_idDisliker`) REFERENCES `db_matcha`.`t_user`(usr_id);
ALTER TABLE `db_matcha`.`t_dislike`
ADD CONSTRAINT FK_Disliked
FOREIGN KEY (`dislike_idDisliked`) REFERENCES `db_matcha`.`t_user`(usr_id);

-- t_like
ALTER TABLE `db_matcha`.`t_like`
ADD CONSTRAINT FK_Liker
FOREIGN KEY (`like_idLiker`) REFERENCES `db_matcha`.`t_user`(usr_id);
ALTER TABLE `db_matcha`.`t_like`
ADD CONSTRAINT FK_Liked
FOREIGN KEY (`like_idLiked`) REFERENCES `db_matcha`.`t_user`(usr_id);

-- t_block
ALTER TABLE `db_matcha`.`t_block`
ADD CONSTRAINT FK_Blocker
FOREIGN KEY (`block_idBlocker`) REFERENCES `db_matcha`.`t_user`(usr_id);
ALTER TABLE `db_matcha`.`t_block`
ADD CONSTRAINT FK_Blocked
FOREIGN KEY (`block_idBlocked`) REFERENCES `db_matcha`.`t_user`(usr_id);

-- t_signal
ALTER TABLE `db_matcha`.`t_signal`
ADD CONSTRAINT FK_Signalor
FOREIGN KEY (`signal_idSignalor`) REFERENCES `db_matcha`.`t_user`(usr_id);
ALTER TABLE `db_matcha`.`t_signal`
ADD CONSTRAINT FK_Signaled
FOREIGN KEY (`signal_idSignaled`) REFERENCES `db_matcha`.`t_user`(usr_id);