-- Task Management System Database Schema
-- This file shows the structure that Sequelize will automatically create
-- No need to run this manually - it's for reference only

CREATE DATABASE IF NOT EXISTS `task_management`;
USE `task_management`;

-- Users Table
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tasks Table
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('To Do','In Progress','Done') DEFAULT 'To Do',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data (will be created automatically by the application)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('Admin User', 'atifnasir83@gmail.com', '$2a$10$...', 'admin', NOW(), NOW()),
('Mujassir Nasir', 'mujassirnasir@gmail.com', '$2a$10$...', 'user', NOW(), NOW()),
('Mustanser Nasir', 'mustansernasir@gmail.com', '$2a$10$...', 'user', NOW(), NOW());