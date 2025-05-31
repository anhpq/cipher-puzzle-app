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


-----------------------stages-----------------------------
INSERT INTO stages (stage_number, stage_name, description, open_code, location_image) VALUES
(1, 'Warm Up', 'All', '1111', 'stage1.jpg'),
(2, 'Trạm Rắn', 'Tặng + CTV', '2222', 'stage2.jpg'),
(3, 'Trạm Mê Cung', 'Thành + CTV', '3333', 'stage3.jpg'),
(4, 'Trạm Cá Sấu', 'Bryan + CTV', '4444', 'stage3.jpg'),
(5, 'Trạm Vòng Xoay', 'Lân + Quốc Anh', '5555', 'stage3.jpg'),
(6, 'Trạm Hồ', 'Lâu + CTV', '6666', 'stage3.jpg'),
(7, 'Trạm Liên Hoàn', 'Tuyền + Thư', '7777', 'stage3.jpg');



---------------------------------questions-----------------------------
INSERT INTO questions (stage_id, question_text, answer, hint1, hint2) VALUES
-- Stage 1 (6 câu hỏi)
(1, 'Question 1 for Stage 1?', 'Answer1', 'Hint 1A', 'Hint 1B'),
(1, 'Question 2 for Stage 1?', 'Answer2', 'Hint 2A', 'Hint 2B'),
(1, 'Question 3 for Stage 1?', 'Answer3', 'Hint 3A', 'Hint 3B'),
(1, 'Question 4 for Stage 1?', 'Answer4', 'Hint 4A', 'Hint 4B'),
(1, 'Question 5 for Stage 1?', 'Answer5', 'Hint 5A', 'Hint 5B'),
(1, 'Question 6 for Stage 1?', 'Answer6', 'Hint 6A', 'Hint 6B'),

-- Stage 2 (2 câu hỏi)
(2, 'Question 1 for Stage 2?', 'Answer7', 'Hint 7A', 'Hint 7B'),
(2, 'Question 2 for Stage 2?', 'Answer8', 'Hint 8A', 'Hint 8B'),

-- Stage 3 (2 câu hỏi)
(3, 'Question 1 for Stage 3?', 'Answer9', 'Hint 9A', 'Hint 9B'),
(3, 'Question 2 for Stage 3?', 'Answer10', 'Hint 10A', 'Hint 10B'),

-- Stage 4 (2 câu hỏi)
(4, 'Question 1 for Stage 4?', 'Answer11', 'Hint 11A', 'Hint 11B'),
(4, 'Question 2 for Stage 4?', 'Answer12', 'Hint 12A', 'Hint 12B'),

-- Stage 5 (2 câu hỏi)
(5, 'Question 1 for Stage 5?', 'Answer13', 'Hint 13A', 'Hint 13B'),
(5, 'Question 2 for Stage 5?', 'Answer14', 'Hint 14A', 'Hint 14B'),

-- Stage 6 (2 câu hỏi)
(6, 'Question 1 for Stage 6?', 'Answer15', 'Hint 15A', 'Hint 15B'),
(6, 'Question 2 for Stage 6?', 'Answer16', 'Hint 16A', 'Hint 16B'),

-- Stage 7 (2 câu hỏi)
(7, 'Question 1 for Stage 7?', 'Answer17', 'Hint 17A', 'Hint 17B'),
(7, 'Question 2 for Stage 7?', 'Answer18', 'Hint 18A', 'Hint 18B');



---------------------------team_routes-----------------------------
-- Seed team_routes cho 10 teams, mỗi team có đầy đủ các stage từ 1 đến 7
INSERT INTO team_routes (team_id, stage_id, route_order) VALUES
  -- Team 1
  (1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 4), (1, 5, 5), (1, 6, 6), (1, 7, 7),

  -- Team 2
  (2, 1, 1), (2, 3, 2), (2, 4, 3), (2, 5, 4), (2, 6, 5), (2, 7, 6), (2, 2, 7),

  -- Team 3
  (3, 1, 1), (3, 4, 2), (3, 5, 3), (3, 6, 4), (3, 7, 5), (3, 2, 6), (3, 3, 7),

  -- Team 4
  (4, 1, 1), (4, 5, 2), (4, 6, 3), (4, 7, 4), (4, 2, 5), (4, 3, 6), (4, 4, 7),

  -- Team 5
  (5, 1, 1), (5, 6, 2), (5, 7, 3), (5, 2, 4), (5, 3, 5), (5, 4, 6), (5, 5, 7),

  -- Team 6
  (6, 1, 1), (6, 7, 2), (6, 2, 3), (6, 3, 4), (6, 4, 5), (6, 5, 6), (6, 6, 7),

  -- Team 7
  (7, 1, 1), (7, 2, 2), (7, 3, 3), (7, 4, 4), (7, 5, 5), (7, 6, 6), (7, 7, 7),

  -- Team 8
  (8, 1, 1), (8, 3, 2), (8, 4, 3), (8, 5, 4), (8, 6, 5), (8, 7, 6), (8, 2, 7),

  -- Team 9
  (9, 1, 1), (9, 4, 2), (9, 5, 3), (9, 6, 4), (9, 7, 5), (9, 2, 6), (9, 3, 7),

  -- Team 10
  (10, 1, 1), (10, 5, 2), (10, 6, 3), (10, 7, 4), (10, 2, 5), (10, 3, 6), (10, 4, 7);



--------------------------------team_question_assignments-----------------------------
INSERT INTO team_question_assignments (team_id, stage_id, question_id, attempts) VALUES
-- Stage 1: 6 câu hỏi
(1, 1, 1, 0), (2, 1, 2, 0), (3, 1, 3, 0), (4, 1, 4, 0), (5, 1, 5, 0),
(6, 1, 6, 0), (7, 1, 1, 0), (8, 1, 2, 0), (9, 1, 3, 0), (10, 1, 6, 0),

-- Stage 2: 2 câu hỏi (7, 8)
(1, 2, 7, 0), (2, 2, 8, 0), (3, 2, 7, 0), (4, 2, 8, 0), (5, 2, 7, 0),
(6, 2, 8, 0), (7, 2, 7, 0), (8, 2, 8, 0), (9, 2, 7, 0), (10, 2, 8, 0),

-- Stage 3: 2 câu hỏi (9, 10)
(1, 3, 9, 0), (2, 3, 10, 0), (3, 3, 9, 0), (4, 3, 10, 0), (5, 3, 9, 0),
(6, 3, 10, 0), (7, 3, 9, 0), (8, 3, 10, 0), (9, 3, 9, 0), (10, 3, 10, 0),

-- Stage 4: 2 câu hỏi (11, 12)
(1, 4, 11, 0), (2, 4, 12, 0), (3, 4, 11, 0), (4, 4, 12, 0), (5, 4, 11, 0),
(6, 4, 12, 0), (7, 4, 11, 0), (8, 4, 12, 0), (9, 4, 11, 0), (10, 4, 12, 0),

-- Stage 5: 2 câu hỏi (13, 14)
(1, 5, 13, 0), (2, 5, 14, 0), (3, 5, 13, 0), (4, 5, 14, 0), (5, 5, 13, 0),
(6, 5, 14, 0), (7, 5, 13, 0), (8, 5, 14, 0), (9, 5, 13, 0), (10, 5, 14, 0),

-- Stage 6: 2 câu hỏi (15, 16)
(1, 6, 15, 0), (2, 6, 16, 0), (3, 6, 15, 0), (4, 6, 16, 0), (5, 6, 15, 0),
(6, 6, 16, 0), (7, 6, 15, 0), (8, 6, 16, 0), (9, 6, 15, 0), (10, 6, 16, 0),

-- Stage 7: 2 câu hỏi (17, 18)
(1, 7, 17, 0), (2, 7, 18, 0), (3, 7, 17, 0), (4, 7, 18, 0), (5, 7, 17, 0),
(6, 7, 18, 0), (7, 7, 17, 0), (8, 7, 18, 0), (9, 7, 17, 0), (10, 7, 18, 0);

