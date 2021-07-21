-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2021 at 05:04 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `boardgamecompare`
--

-- --------------------------------------------------------

--
-- Table structure for table `compare`
--

CREATE TABLE `compare` (
  `ID` int(11) NOT NULL,
  `gameA` int(11) NOT NULL,
  `gameB` int(11) NOT NULL,
  `WinnerMechanically` int(11) DEFAULT NULL,
  `WinnerDepth` int(11) DEFAULT NULL,
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `compare`
--
ALTER TABLE `compare`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `gameA` (`gameA`),
  ADD KEY `gameB` (`gameB`),
  ADD KEY `WinnerMechanically` (`WinnerMechanically`),
  ADD KEY `WinnerDepth` (`WinnerDepth`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `compare`
--
ALTER TABLE `compare`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `compare`
--
ALTER TABLE `compare`
  ADD CONSTRAINT `compare_ibfk_1` FOREIGN KEY (`gameA`) REFERENCES `games` (`gameID`),
  ADD CONSTRAINT `compare_ibfk_2` FOREIGN KEY (`gameB`) REFERENCES `games` (`gameID`),
  ADD CONSTRAINT `compare_ibfk_3` FOREIGN KEY (`WinnerMechanically`) REFERENCES `games` (`gameID`),
  ADD CONSTRAINT `compare_ibfk_4` FOREIGN KEY (`WinnerDepth`) REFERENCES `games` (`gameID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
