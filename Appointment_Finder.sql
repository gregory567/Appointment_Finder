-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 23, 2023 at 10:48 AM
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

--
-- Dumping data for table `Appointment`
--

INSERT INTO `Appointment` (`App_ID`, `Titel`, `Ort`, `Ablaufdatum`) VALUES
(13, 'Fussball Training', 'Platz 1', '2023-04-20'),
(14, 'Buchbörse', 'Bibliothek', '2023-04-20'),
(15, 'Film', 'Kino', '2023-04-20'),
(16, 'Konzert', 'Konzerthaus', '2023-04-20');

-- --------------------------------------------------------

--
-- Table structure for table `Gebucht`
--

CREATE TABLE `Gebucht` (
  `FK_Termin_ID` int(11) NOT NULL,
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
  `Uhrzeit_von` varchar(5) NOT NULL,
  `Uhrzeit_bis` varchar(5) NOT NULL,
  `FK_App_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Termin`
--

INSERT INTO `Termin` (`Termin_ID`, `Datum`, `Uhrzeit_von`, `Uhrzeit_bis`, `FK_App_ID`) VALUES
(1, '2023-04-17', '18:30', '19:00', 13),
(2, '2023-04-17', '19:00', '19:30', 13),
(3, '2023-04-17', '20:30', '21:00', 13),
(4, '2023-04-17', '21:30', '22:00', 13);

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
  ADD PRIMARY KEY (`FK_Termin_ID`,`FK_User_ID`),
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
  MODIFY `App_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `Termin`
--
ALTER TABLE `Termin`
  MODIFY `Termin_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  ADD CONSTRAINT `constrFK_Term_ID` FOREIGN KEY (`FK_Termin_ID`) REFERENCES `Termin` (`Termin_ID`),
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
