-- schema.sql

--- Tạo bảng "teams"
CREATE TABLE IF NOT EXISTS teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    current_stage_id INTEGER DEFAULT 1,
    start_time TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tạo bảng "stages"
CREATE TABLE IF NOT EXISTS stages (
    stage_id SERIAL PRIMARY KEY,
    stage_number INTEGER NOT NULL,
    stage_name VARCHAR(255) NOT NULL,
    description TEXT,
    open_code VARCHAR(255),
    location_image BYTEA,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tạo bảng "questions"
CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL PRIMARY KEY,
    stage_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    answer VARCHAR(255) NOT NULL,
    hint1 BYTEA,
    hint2 BYTEA,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_stage
      FOREIGN KEY (stage_id)
      REFERENCES stages(stage_id)
      ON DELETE CASCADE
);

-- Tạo bảng "team_routes"
CREATE TABLE IF NOT EXISTS team_routes (
    team_route_id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    stage_id INTEGER NOT NULL,
    route_order INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_team_route UNIQUE (team_id, route_order),
    CONSTRAINT fk_team
      FOREIGN KEY (team_id)
      REFERENCES teams(team_id)
      ON DELETE CASCADE,
    CONSTRAINT fk_route_stage
      FOREIGN KEY (stage_id)
      REFERENCES stages(stage_id)
      ON DELETE CASCADE
);

-- Tạo bảng "team_question_assignments"
CREATE TABLE IF NOT EXISTS team_question_assignments (
    assignment_id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    stage_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    attempts INTEGER DEFAULT 0,
    CONSTRAINT fk_team_assignment
      FOREIGN KEY (team_id)
      REFERENCES teams(team_id)
      ON DELETE CASCADE,
    CONSTRAINT fk_stage_assignment
      FOREIGN KEY (stage_id)
      REFERENCES stages(stage_id)
      ON DELETE CASCADE,
    CONSTRAINT fk_question_assignment
      FOREIGN KEY (question_id)
      REFERENCES questions(question_id)
      ON DELETE CASCADE
);

CREATE VIEW team_current_stage AS
SELECT t.team_id,
       (
         SELECT tr.stage_id
         FROM team_routes tr
         WHERE tr.team_id = t.team_id AND tr.completed = FALSE
         ORDER BY tr.route_order
         LIMIT 1
       ) AS current_stage_id
FROM teams t;