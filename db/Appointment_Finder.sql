-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 27, 2023 at 03:57 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Appointment_Finder`
--
CREATE DATABASE IF NOT EXISTS `Appointment_Finder` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `Appointment_Finder`;

-- --------------------------------------------------------

--
-- Table structure for table `Appointment`
--

CREATE TABLE `Appointment` (
  `App_ID` int(11) NOT NULL,
  `Titel` varchar(50) NOT NULL,
  `Ort` varchar(50) NOT NULL,
  `Ablaufdatum` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `Appointment`:
--

--
-- Dumping data for table `Appointment`
--

INSERT INTO `Appointment` (`App_ID`, `Titel`, `Ort`, `Ablaufdatum`) VALUES
(82, 'Fußball', 'Platz1', '2023-05-06'),
(83, 'Kinobesuch', 'ApolloKino', '2023-05-05'),
(84, 'Buchclub', 'Bibliothek', '2023-05-24'),
(85, 'Theaterbesuch', 'Burgtheater', '2023-04-25');

-- --------------------------------------------------------

--
-- Table structure for table `Gebucht`
--

CREATE TABLE `Gebucht` (
  `FK_Termin_ID` int(11) NOT NULL,
  `FK_User_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `Gebucht`:
--   `FK_Termin_ID`
--       `Termin` -> `Termin_ID`
--   `FK_User_ID`
--       `User` -> `User_ID`
--   `FK_Termin_ID`
--       `Termin` -> `Termin_ID`
--   `FK_User_ID`
--       `User` -> `User_ID`
--

-- --------------------------------------------------------

--
-- Table structure for table `Kommentiert`
--

CREATE TABLE `Kommentiert` (
  `FK_User_ID` int(11) NOT NULL,
  `FK_App_ID` int(11) NOT NULL,
  `Kommentar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `Kommentiert`:
--   `FK_App_ID`
--       `Appointment` -> `App_ID`
--   `FK_User_ID`
--       `User` -> `User_ID`
--   `FK_App_ID`
--       `Appointment` -> `App_ID`
--   `FK_User_ID`
--       `User` -> `User_ID`
--

-- --------------------------------------------------------

--
-- Table structure for table `Termin`
--

CREATE TABLE `Termin` (
  `Termin_ID` int(11) NOT NULL,
  `Datum` date NOT NULL,
  `Uhrzeit_von` varchar(5) NOT NULL,
  `Uhrzeit_bis` varchar(5) NOT NULL,
  `FK_App_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `Termin`:
--   `FK_App_ID`
--       `Appointment` -> `App_ID`
--   `FK_App_ID`
--       `Appointment` -> `App_ID`
--

--
-- Dumping data for table `Termin`
--

INSERT INTO `Termin` (`Termin_ID`, `Datum`, `Uhrzeit_von`, `Uhrzeit_bis`, `FK_App_ID`) VALUES
(105, '2023-05-11', '16:00', '17:00', 82),
(106, '2023-04-28', '18:00', '19:00', 83),
(107, '2023-04-29', '16:00', '17:00', 83),
(108, '2023-05-17', '17:00', '21:00', 84),
(109, '2023-05-04', '10:00', '11:00', 84),
(110, '2023-05-10', '13:14', '14:25', 84);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `User_ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `FK_App_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `User`:
--   `FK_App_ID`
--       `Appointment` -> `App_ID`
--   `FK_App_ID`
--       `Appointment` -> `App_ID`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Appointment`
--
ALTER TABLE `Appointment`
  ADD PRIMARY KEY (`App_ID`);

--
-- Indexes for table `Gebucht`
--
ALTER TABLE `Gebucht`
  ADD PRIMARY KEY (`FK_Termin_ID`,`FK_User_ID`),
  ADD KEY `constrFK_User_ID` (`FK_User_ID`),
  ADD KEY `constrFK_Term_ID` (`FK_Termin_ID`);

--
-- Indexes for table `Kommentiert`
--
ALTER TABLE `Kommentiert`
  ADD PRIMARY KEY (`FK_User_ID`,`FK_App_ID`),
  ADD KEY `constrFK_App_ID` (`FK_App_ID`),
  ADD KEY `constr_User_ID_2` (`FK_User_ID`);

--
-- Indexes for table `Termin`
--
ALTER TABLE `Termin`
  ADD PRIMARY KEY (`Termin_ID`),
  ADD KEY `contrFK_App_ID` (`FK_App_ID`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`User_ID`),
  ADD KEY `constrFK_App_ID_User` (`FK_App_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Appointment`
--
ALTER TABLE `Appointment`
  MODIFY `App_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `Termin`
--
ALTER TABLE `Termin`
  MODIFY `Termin_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Gebucht`
--
ALTER TABLE `Gebucht`
  ADD CONSTRAINT `constrFK_Term_ID` FOREIGN KEY (`FK_Termin_ID`) REFERENCES `Termin` (`Termin_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `constrFK_User_ID` FOREIGN KEY (`FK_User_ID`) REFERENCES `User` (`User_ID`) ON DELETE CASCADE;

--
-- Constraints for table `Kommentiert`
--
ALTER TABLE `Kommentiert`
  ADD CONSTRAINT `constrFK_App_ID` FOREIGN KEY (`FK_App_ID`) REFERENCES `Appointment` (`App_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `constrFK_User_ID_2` FOREIGN KEY (`FK_User_ID`) REFERENCES `User` (`User_ID`) ON DELETE CASCADE;

--
-- Constraints for table `Termin`
--
ALTER TABLE `Termin`
  ADD CONSTRAINT `contrFK_App_ID` FOREIGN KEY (`FK_App_ID`) REFERENCES `Appointment` (`App_ID`) ON DELETE CASCADE;

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `constrFK_App_ID_User` FOREIGN KEY (`FK_App_ID`) REFERENCES `Appointment` (`App_ID`) ON DELETE CASCADE;
COMMIT;


GRANT ALL PRIVILEGES ON *.* TO `bif2webscriptinguser`@`localhost` IDENTIFIED BY PASSWORD '*4680BADAC6AB3959526F032A7B3A60C1EC163F9F' WITH GRANT OPTION;

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, REFERENCES, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EVENT, TRIGGER ON `appointment\_finder`.* TO `bif2webscriptinguser`@`localhost`;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
