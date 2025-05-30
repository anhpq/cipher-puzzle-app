-- seed.sql

-- Insert sample data into the teams table.
INSERT INTO teams (team_name, password)
VALUES
  ('Alpha',   'A7X9'),
  ('Beta',    'B4L2'),
  ('Gamma',   'G3M1'),
  ('Delta',   'D2K8'),
  ('Epsilon', 'E9Q5'),
  ('Zeta',    'Z1R4'),
  ('Omega',   'O5T7'),
  ('Sigma',   'S8W3'),
  ('Titan',   'T6N0'),
  ('Nova',    'N2Y6')
  ;

SET client_encoding = 'UTF8';
-- 2. INSERT SAMPLE DATA FOR STAGES

INSERT INTO stages (stage_number, stage_name, description, open_code, location_image) VALUES
(1, 'Warm Up', 'All', '1111', 'stage1.jpg'),
(2, 'Trạm Rắn', 'Tặng + CTV', '2222', 'stage2.jpg'),
(3, 'Trạm Mê Cung', 'Thành + CTV', '3333', 'stage3.jpg'),
(4, 'Trạm Cá Sấu', 'Bryan + CTV', '4444', 'stage3.jpg'),
(5, 'Trạm Vòng Xoay', 'Lân + Quốc Anh', '5555', 'stage3.jpg'),
(6, 'Trạm Hồ', 'Lâu + CTV', '6666', 'stage3.jpg'),
(7, 'Trạm Liên Hoàn', 'Tuyền + Thư', '7777', 'stage3.jpg');

-- For Stage 1: 2 câu hỏi
INSERT INTO questions (stage_id, question_text, answer, hint1, hint2) VALUES
(1, 'What is 2+2?', '4', 'Basic arithmetic.', 'Think of a square.'),
(1, 'What color is the sky on a clear day?', 'blue', 'Associated with calm.', 'Same color as the ocean.');

-- For Stage 2: 3 câu hỏi
INSERT INTO questions (stage_id, question_text, answer, hint1, hint2) VALUES
(2, 'Solve for x: 3x + 7 = 16', '3', 'Subtract 7 and divide by 3.', 'x should be simple.'),
(2, 'What is the capital city of France?', 'Paris', 'City of Lights.', 'Famous for the Eiffel Tower.'),
(2, 'What is H2O commonly known as?', 'water', 'Essential for life.', 'Used in drinks.');

-- For Stage 3: 2 câu hỏi
INSERT INTO questions (stage_id, question_text, answer, hint1, hint2) VALUES
(3, 'What planet do we live on?', 'Earth', 'It is our home.', 'Known as the blue planet.'),
(3, 'At what temperature does water boil at sea level (in Celsius)?', '100', 'Standard boiling point.', 'A round number.');

-- For Stage 4: 3 câu hỏi
INSERT INTO questions (stage_id, question_text, answer, hint1, hint2) VALUES
(4, 'What is the largest mammal in the world?', 'Blue Whale', 'Lives in the ocean.', 'A type of whale.'),
(4, 'On which continent is Brazil located?', 'South America', 'Famous for the Amazon rainforest.', 'Not in North America.'),
(4, 'What is 10 multiplied by 10?', '100', 'Think of a square with equal sides.', 'It is a perfect square.');

-- For Stage 5: 2 câu hỏi
INSERT INTO questions (stage_id, question_text, answer, hint1, hint2) VALUES
(5, 'What is 5 squared?', '25', 'Multiply 5 by itself.', 'A number between 20 and 30.'),
(5, 'What is the chemical symbol for Gold?', 'Au', 'Derived from the Latin name for gold.', 'It consists of two letters.');

-- For Stage 6: 3 câu hỏi
INSERT INTO questions (stage_id, question_text, answer, hint1, hint2) VALUES
(6, 'What is the process of water turning into vapor called?', 'Evaporation', 'It occurs when water heats up.', 'Opposite of condensation.'),
(6, 'What is the official currency of Japan?', 'Yen', 'It is abbreviated as JPY.', 'A small unit of money.'),
(6, 'At what temperature does water freeze in Celsius?', '0', 'This is the standard freezing point.', 'Think zero.');

-- For Stage 7: 2 câu hỏi
INSERT INTO questions (stage_id, question_text, answer, hint1, hint2) VALUES
(7, 'Type "final" to complete the game.', 'final', 'It signals the end.', 'Opposite of start.'),
(7, 'What is the sum of 7 and 8?', '15', 'Add these two numbers together.', 'It is a teen number.');

-- Seed team_routes cho 10 teams, mỗi team có đầy đủ các stage từ 1 đến 7
INSERT INTO team_routes (team_id, stage_id, route_order) VALUES
  -- Team 1
  (1, 1, 1),
  (1, 2, 2),
  (1, 3, 3),
  (1, 4, 4),
  (1, 5, 5),
  (1, 6, 6),
  (1, 7, 7),
  -- Team 2
  (2, 1, 1),
  (2, 2, 2),
  (2, 3, 3),
  (2, 4, 4),
  (2, 5, 5),
  (2, 6, 6),
  (2, 7, 7),
  -- Team 3
  (3, 1, 1),
  (3, 2, 2),
  (3, 3, 3),
  (3, 4, 4),
  (3, 5, 5),
  (3, 6, 6),
  (3, 7, 7),
  -- Team 4
  (4, 1, 1),
  (4, 2, 2),
  (4, 3, 3),
  (4, 4, 4),
  (4, 5, 5),
  (4, 6, 6),
  (4, 7, 7),
  -- Team 5
  (5, 1, 1),
  (5, 2, 2),
  (5, 3, 3),
  (5, 4, 4),
  (5, 5, 5),
  (5, 6, 6),
  (5, 7, 7),
  -- Team 6
  (6, 1, 1),
  (6, 2, 2),
  (6, 3, 3),
  (6, 4, 4),
  (6, 5, 5),
  (6, 6, 6),
  (6, 7, 7),
  -- Team 7
  (7, 1, 1),
  (7, 2, 2),
  (7, 3, 3),
  (7, 4, 4),
  (7, 5, 5),
  (7, 6, 6),
  (7, 7, 7),
  -- Team 8
  (8, 1, 1),
  (8, 2, 2),
  (8, 3, 3),
  (8, 4, 4),
  (8, 5, 5),
  (8, 6, 6),
  (8, 7, 7),
  -- Team 9
  (9, 1, 1),
  (9, 2, 2),
  (9, 3, 3),
  (9, 4, 4),
  (9, 5, 5),
  (9, 6, 6),
  (9, 7, 7),
  -- Team 10
  (10, 1, 1),
  (10, 2, 2),
  (10, 3, 3),
  (10, 4, 4),
  (10, 5, 5),
  (10, 6, 6),
  (10, 7, 7);

-- Stage 1: mỗi team nhận 1 câu hỏi
INSERT INTO team_question_assignments (team_id, stage_id, question_id, attempts) VALUES
  (1, 1, 1, 0),
  (2, 1, 2, 0),
  (3, 1, 1, 0),
  (4, 1, 2, 0),
  (5, 1, 1, 0),
  (6, 1, 2, 0),
  (7, 1, 1, 0),
  (8, 1, 2, 0),
  (9, 1, 1, 0),
  (10, 1, 2, 0);
-- Stage 2:
INSERT INTO team_question_assignments (team_id, stage_id, question_id, attempts) VALUES
  (1, 2, 3, 0),  -- 1 mod 3 = 1
  (2, 2, 4, 0),  -- 2 mod 3 = 2
  (3, 2, 5, 0),  -- 3 mod 3 = 0
  (4, 2, 3, 0),  -- 4 mod 3 = 1
  (5, 2, 4, 0),  -- 5 mod 3 = 2
  (6, 2, 5, 0),  -- 6 mod 3 = 0
  (7, 2, 3, 0),  -- 7 mod 3 = 1
  (8, 2, 4, 0),  -- 8 mod 3 = 2
  (9, 2, 5, 0),  -- 9 mod 3 = 0
  (10, 2, 3, 0); -- 10 mod 3 = 1
-- Stage 3:
INSERT INTO team_question_assignments (team_id, stage_id, question_id, attempts) VALUES
  (1, 3, 6, 0),
  (2, 3, 7, 0),
  (3, 3, 6, 0),
  (4, 3, 7, 0),
  (5, 3, 6, 0),
  (6, 3, 7, 0),
  (7, 3, 6, 0),
  (8, 3, 7, 0),
  (9, 3, 6, 0),
  (10, 3, 7, 0);
-- Stage 4:
INSERT INTO team_question_assignments (team_id, stage_id, question_id, attempts) VALUES
  (1, 4, 8, 0),   -- 1 mod 3 = 1
  (2, 4, 9, 0),   -- 2 mod 3 = 2
  (3, 4, 10, 0),  -- 3 mod 3 = 0
  (4, 4, 8, 0),   -- 4 mod 3 = 1
  (5, 4, 9, 0),   -- 5 mod 3 = 2
  (6, 4, 10, 0),  -- 6 mod 3 = 0
  (7, 4, 8, 0),   -- 7 mod 3 = 1
  (8, 4, 9, 0),   -- 8 mod 3 = 2
  (9, 4, 10, 0),  -- 9 mod 3 = 0
  (10, 4, 8, 0);  -- 10 mod 3 = 1
-- Stage 5:
INSERT INTO team_question_assignments (team_id, stage_id, question_id, attempts) VALUES
  (1, 5, 11, 0),
  (2, 5, 12, 0),
  (3, 5, 11, 0),
  (4, 5, 12, 0),
  (5, 5, 11, 0),
  (6, 5, 12, 0),
  (7, 5, 11, 0),
  (8, 5, 12, 0),
  (9, 5, 11, 0),
  (10, 5, 12, 0);
-- Stage 6:
INSERT INTO team_question_assignments (team_id, stage_id, question_id, attempts) VALUES
  (1, 6, 13, 0),   -- 1 mod 3 = 1
  (2, 6, 14, 0),   -- 2 mod 3 = 2
  (3, 6, 15, 0),   -- 3 mod 3 = 0
  (4, 6, 13, 0),   -- 4 mod 3 = 1
  (5, 6, 14, 0),   -- 5 mod 3 = 2
  (6, 6, 15, 0),   -- 6 mod 3 = 0
  (7, 6, 13, 0),   -- 7 mod 3 = 1
  (8, 6, 14, 0),   -- 8 mod 3 = 2
  (9, 6, 15, 0),   -- 9 mod 3 = 0
  (10, 6, 13, 0);  -- 10 mod 3 = 1
-- Stage 7:
INSERT INTO team_question_assignments (team_id, stage_id, question_id, attempts) VALUES
  (1, 7, 16, 0),
  (2, 7, 17, 0),
  (3, 7, 16, 0),
  (4, 7, 17, 0),
  (5, 7, 16, 0),
  (6, 7, 17, 0),
  (7, 7, 16, 0),
  (8, 7, 17, 0),
  (9, 7, 16, 0),
  (10, 7, 17, 0);
