/*
    DATABASE creation
    Matcha Project
    krambono - mhotting
    2019
*/

/* ************************************************************ */
-- Database creations
/* ************************************************************ */
CREATE SCHEMA `matcha` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `matcha`;


/* ************************************************************ */
-- Table creations
/* ************************************************************ */

-- db_user
CREATE TABLE `matcha`.`db_user` (
  `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_firstName` VARCHAR(255) NOT NULL,
  `user_lastName` VARCHAR(255) NOT NULL,
  `user_birthDate` DATE NOT NULL,
  `user_email` VARCHAR(255) NOT NULL,
  `user_password` VARCHAR(255) NOT NULL,
  `user_age` INT NOT NULL,
  `user_gender` VARCHAR(1) NOT NULL,
  `user_description` TEXT NULL,
  `user_score` INT NOT NULL DEFAULT 0,
  `user_status` VARCHAR(255) NULL,
  `user_location` VARCHAR(255) NULL,
  `user_creationDate` DATETIME NOT NULL DEFAULT NOW(),
  `user_connectionDate` DATETIME NULL,
  `user_activationToken` VARCHAR(255) NOT NULL,
  `user_passwordToken` VARCHAR(255) NOT NULL,
  `user_idOrientation` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC)
  )
  ENGINE=InnoDB;

-- db_message
CREATE TABLE `matcha`.`db_message` (
  `message_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `message_content` TEXT NULL,
  `message_creationDate` DATETIME NOT NULL DEFAULT NOW(),
  `message_idSender` INT UNSIGNED NOT NULL,
  `message_idReceiver` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`message_id`),
  UNIQUE INDEX `message_id_UNIQUE` (`message_id` ASC)
  )
  ENGINE=InnoDB;

-- db_image
CREATE TABLE `matcha`.`db_image` (
  `image_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `image_path` VARCHAR(255) NOT NULL,
  `image_idUser` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`image_id`),
  UNIQUE INDEX `image_id_UNIQUE` (`image_id` ASC)
  )
  ENGINE=InnoDB;

-- db_orientation
CREATE TABLE `matcha`.`db_orientation` (
  `orientation_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `orientation_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`orientation_id`),
  UNIQUE INDEX `orientation_id_UNIQUE` (`orientation_id` ASC),
  UNIQUE INDEX `orientation_name_UNIQUE` (`orientation_name` ASC)
  )
  ENGINE=InnoDB;

-- db_interest
CREATE TABLE `matcha`.`db_interest` (
  `interest_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `interest_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`interest_id`),
  UNIQUE INDEX `interest_id_UNIQUE` (`interest_id` ASC),
  UNIQUE INDEX `interest_name_UNIQUE` (`interest_name` ASC)
  )
  ENGINE=InnoDB;

-- db_notif
CREATE TABLE `matcha`.`db_notification` (
  `notif_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `notif_creationDate` DATETIME NOT NULL DEFAULT NOW(),
  `notif_consulted` TINYINT NOT NULL DEFAULT 0,
  `notif_category` VARCHAR(45) NOT NULL,
  `notif_idUser` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`notif_id`),
  UNIQUE INDEX `notif_id_UNIQUE` (`notif_id` ASC)
  )
  ENGINE=InnoDB;

-- db_userInterest
CREATE TABLE `matcha`.`db_userInterest` (
  `userInterest_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userInterest_idUser` INT UNSIGNED NOT NULL,
  `userInterest_idInterest` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`userInterest_id`),
  UNIQUE INDEX `userInterest_id_UNIQUE` (`userInterest_id` ASC)
  )
  ENGINE=InnoDB;

-- db_visit
CREATE TABLE `matcha`.`db_visit` (
  `visit_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `visit_idVisitor` INT UNSIGNED NOT NULL,
  `visit_idVisited` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`visit_id`),
  UNIQUE INDEX `visit_id_UNIQUE` (`visit_id` ASC)
  )
  ENGINE=InnoDB;

-- db_dislike
CREATE TABLE `matcha`.`db_dislike` (
  `dislike_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dislike_idDisliked` INT UNSIGNED NOT NULL,
  `dislike_idDisliker` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`dislike_id`),
  UNIQUE INDEX `dislike_id_UNIQUE` (`dislike_id` ASC)
  )
  ENGINE=InnoDB;

-- db_like
CREATE TABLE `matcha`.`db_like` (
  `like_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `like_idLiked` INT UNSIGNED NOT NULL,
  `like_idLiker` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`like_id`),
  UNIQUE INDEX `like_id_UNIQUE` (`like_id` ASC)
  )
  ENGINE=InnoDB;

-- db_block
CREATE TABLE `matcha`.`db_block` (
  `block_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_idBlocked` INT UNSIGNED NOT NULL,
  `block_idBlocker` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`block_id`),
  UNIQUE INDEX `block_id_UNIQUE` (`block_id` ASC)
  )
  ENGINE=InnoDB;

-- db_signal
CREATE TABLE `matcha`.`db_signal` (
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

-- db_user
ALTER TABLE `matcha`.`db_user`
ADD CONSTRAINT FK_UserOrientation
FOREIGN KEY (`user_idOrientation`) REFERENCES `matcha`.`db_orientation`(orientation_id);

-- db_image
ALTER TABLE `matcha`.`db_image`
ADD CONSTRAINT FK_ImageUser
FOREIGN KEY (`image_idUser`) REFERENCES `matcha`.`db_user`(user_id);

-- db_message
ALTER TABLE `matcha`.`db_message`
ADD CONSTRAINT FK_MessageSender
FOREIGN KEY (`message_idSender`) REFERENCES `matcha`.`db_user`(user_id);
ALTER TABLE `matcha`.`db_message`
ADD CONSTRAINT FK_MessageReceiver
FOREIGN KEY (`message_idReceiver`) REFERENCES `matcha`.`db_user`(user_id);

-- db_userInterest
ALTER TABLE `matcha`.`db_userInterest`
ADD CONSTRAINT FK_InterestUser
FOREIGN KEY (`userInterest_idUser`) REFERENCES `matcha`.`db_user`(user_id);
ALTER TABLE `matcha`.`db_userInterest`
ADD CONSTRAINT FK_UserInterest
FOREIGN KEY (`userInterest_idInterest`) REFERENCES `matcha`.`db_interest`(interest_id);

-- db_notif
ALTER TABLE `matcha`.`db_notification`
ADD CONSTRAINT FK_notifUser
FOREIGN KEY (`notif_idUser`) REFERENCES `matcha`.`db_user`(user_id);

-- db_visit
ALTER TABLE `matcha`.`db_visit`
ADD CONSTRAINT FK_Visitor
FOREIGN KEY (`visit_idVisitor`) REFERENCES `matcha`.`db_user`(user_id);
ALTER TABLE `matcha`.`db_visit`
ADD CONSTRAINT FK_Visited
FOREIGN KEY (`visit_idVisited`) REFERENCES `matcha`.`db_user`(user_id);

-- db_dislike
ALTER TABLE `matcha`.`db_dislike`
ADD CONSTRAINT FK_Disliker
FOREIGN KEY (`dislike_idDisliker`) REFERENCES `matcha`.`db_user`(user_id);
ALTER TABLE `matcha`.`db_dislike`
ADD CONSTRAINT FK_Disliked
FOREIGN KEY (`dislike_idDisliked`) REFERENCES `matcha`.`db_user`(user_id);

-- db_like
ALTER TABLE `matcha`.`db_like`
ADD CONSTRAINT FK_Liker
FOREIGN KEY (`like_idLiker`) REFERENCES `matcha`.`db_user`(user_id);
ALTER TABLE `matcha`.`db_like`
ADD CONSTRAINT FK_Liked
FOREIGN KEY (`like_idLiked`) REFERENCES `matcha`.`db_user`(user_id);

-- db_block
ALTER TABLE `matcha`.`db_block`
ADD CONSTRAINT FK_Blocker
FOREIGN KEY (`block_idBlocker`) REFERENCES `matcha`.`db_user`(user_id);
ALTER TABLE `matcha`.`db_block`
ADD CONSTRAINT FK_Blocked
FOREIGN KEY (`block_idBlocked`) REFERENCES `matcha`.`db_user`(user_id);

-- db_signal
ALTER TABLE `matcha`.`db_signal`
ADD CONSTRAINT FK_Signalor
FOREIGN KEY (`signal_idSignalor`) REFERENCES `matcha`.`db_user`(user_id);
ALTER TABLE `matcha`.`db_signal`
ADD CONSTRAINT FK_Signaled
FOREIGN KEY (`signal_idSignaled`) REFERENCES `matcha`.`db_user`(user_id);