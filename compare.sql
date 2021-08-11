CREATE TABLE compare (
  ID SERIAL,
  gameA integer NOT NULL,
  gameB integer NOT NULL,
  WinnerMechanically integer DEFAULT null,
  WinnerDepth integer DEFAULT null,
  "user" integer NOT NULL
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table compare
--
ALTER TABLE compare
  ADD PRIMARY KEY (ID);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table compare
--
ALTER TABLE compare
  MODIFY ID INT NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table compare
--
ALTER TABLE compare
  ADD CONSTRAINT compare_ibfk_1 FOREIGN KEY (gameA) REFERENCES games (gameID),
  ADD CONSTRAINT compare_ibfk_2 FOREIGN KEY (gameB) REFERENCES games (gameID),
  ADD CONSTRAINT compare_ibfk_3 FOREIGN KEY (WinnerMechanically) REFERENCES games (gameID),
  ADD CONSTRAINT compare_ibfk_4 FOREIGN KEY (WinnerDepth) REFERENCES games (gameID);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
