-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 19, 2023 at 01:43 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `Appointment`
--

CREATE TABLE `Appointment` (
  `App_ID` int(11) NOT NULL,
  `Titel` varchar(50) NOT NULL,
  `Ort` varchar(50) NOT NULL,
  `Ablaufdatum` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Gebucht`
--

CREATE TABLE `Gebucht` (
  `FK_TermID_ID` int(11) NOT NULL,
  `FK_User_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Kommentiert`
--

CREATE TABLE `Kommentiert` (
  `FK_User_ID` int(11) NOT NULL,
  `FK_App_ID` int(11) NOT NULL,
  `Kommentar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Termin`
--

CREATE TABLE `Termin` (
  `Termin_ID` int(11) NOT NULL,
  `Datum` date NOT NULL,
  `Uhrzeit_von` date NOT NULL,
  `Uhrzeit_bis` date NOT NULL,
  `FK_App_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `User_ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  ADD PRIMARY KEY (`FK_TermID_ID`,`FK_User_ID`),
  ADD KEY `constrFK_User_ID` (`FK_User_ID`);

--
-- Indexes for table `Kommentiert`
--
ALTER TABLE `Kommentiert`
  ADD PRIMARY KEY (`FK_User_ID`,`FK_App_ID`),
  ADD KEY `constrFK_App_ID` (`FK_App_ID`);

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
  ADD PRIMARY KEY (`User_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Appointment`
--
ALTER TABLE `Appointment`
  MODIFY `App_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Termin`
--
ALTER TABLE `Termin`
  MODIFY `Termin_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Gebucht`
--
ALTER TABLE `Gebucht`
  ADD CONSTRAINT `constrFK_Term_ID` FOREIGN KEY (`FK_TermID_ID`) REFERENCES `Termin` (`Termin_ID`),
  ADD CONSTRAINT `constrFK_User_ID` FOREIGN KEY (`FK_User_ID`) REFERENCES `User` (`User_ID`);

--
-- Constraints for table `Kommentiert`
--
ALTER TABLE `Kommentiert`
  ADD CONSTRAINT `constrFK_App_ID` FOREIGN KEY (`FK_App_ID`) REFERENCES `Appointment` (`App_ID`),
  ADD CONSTRAINT `constrFK_User_ID_2` FOREIGN KEY (`FK_User_ID`) REFERENCES `User` (`User_ID`);

--
-- Constraints for table `Termin`
--
ALTER TABLE `Termin`
  ADD CONSTRAINT `contrFK_App_ID` FOREIGN KEY (`FK_App_ID`) REFERENCES `Appointment` (`App_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
