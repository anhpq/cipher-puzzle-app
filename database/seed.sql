-- seed.sql

-- Insert sample data into the teams table.
INSERT INTO teams (teamname, password, currentstage, routestages)
VALUES
  ('Alpha',   'A7X9', 0, ARRAY[1,2,3,4,5,6,7]),
  ('Beta',    'B4L2', 0, ARRAY[1,3,4,5,6,7,2]),
  ('Gamma',   'G3M1', 0, ARRAY[1,4,5,6,7,2,3]),
  ('Delta',   'D2K8', 0, ARRAY[1,5,6,7,2,3,4]),
  ('Epsilon', 'E9Q5', 0, ARRAY[1,6,7,2,3,4,5]),
  ('Zeta',    'Z1R4', 0, ARRAY[1,7,2,3,4,5,6]),
  ('Omega',   'O5T7', 0, ARRAY[1,2,3,4,5,6,7]),
  ('Sigma',   'S8W3', 0, ARRAY[1,3,4,5,6,7,2]),
  ('Titan',   'T6N0', 0, ARRAY[1,4,5,6,7,2,3]),
  ('Nova',    'N2Y6', 0, ARRAY[1,5,6,7,2,3,4])
  ;
  
-- Optionally, insert seed data into the game_settings table.
INSERT INTO game_settings (game_state)
VALUES ('not_started');

SET client_encoding = 'UTF8';
INSERT INTO stages (stage_name, description, open_code)
VALUES 
  ('Warm Up', 'All', '1111'),
  ('Trạm Rắn', 'Tặng + CTV', '2222'),
  ('Trạm Mê Cung', 'Thành + CTV', '3333'),
  ('Trạm Cá Sấu', 'Bryan + CTV', '4444'),
  ('Trạm Vòng Xoay', 'Lân + Quốc Anh', '5555'),
  ('Trạm Hồ', 'Lâu + CTV', '6666'),
  ('Trạm Liên Hoàn', 'Tuyền + Thư', '7777');
