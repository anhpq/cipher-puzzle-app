-- schema.sql

-- Create session table (for PostgreSQL-backed session store).
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

--------------------------------------------------------------------
-- Game Settings Table
--------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS game_settings (
  id SERIAL PRIMARY KEY,
  game_state VARCHAR(50) NOT NULL DEFAULT 'not_started',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------
-- Users Table (for admin and/or team authentication)
--------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- In production, store hashed passwords.
  role VARCHAR(50) NOT NULL         -- e.g., 'admin', 'team'
);

--------------------------------------------------------------------
-- Teams Table
--------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teams (
  teamid SERIAL PRIMARY KEY,
  teamname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Consider using hashed passwords.
  currentstage INTEGER DEFAULT 0,
  routestages INTEGER[],          -- e.g., [1,2,3,4,5,6]
  starttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completiontimes TIMESTAMP[]     -- Array for stage completion timestamps
);

--------------------------------------------------------------------
-- Stages Table
-- Contains master data for stages. Includes the open_code
-- that teams must enter to unlock the stage.
--------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stages (
  stage_id SERIAL PRIMARY KEY,
  stage_name VARCHAR(255) NOT NULL,
  description TEXT,
  open_code VARCHAR(255) NOT NULL,
  location_image BYTEA  -- will store the binary data of the image
);

--------------------------------------------------------------------
-- Questions Table
-- Each stage may have multiple questions.
--------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
  question_id SERIAL PRIMARY KEY,
  stage_id INTEGER REFERENCES stages(stage_id),
  question_text TEXT NOT NULL,
  answer TEXT NOT NULL,
  hint1 BYTEA,  -- stores the first hint image (if any)
  hint2 BYTEA   -- stores the second hint image (if any)
);

--------------------------------------------------------------------
-- Team Progress Table
-- Tracks which question was answered by a team in a particular stage,
-- useful for dynamic routing.
--------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_progress (
  progress_id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(teamid),
  stage_id INTEGER REFERENCES stages(stage_id),
  question_id INTEGER REFERENCES questions(question_id),
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_correct BOOLEAN
);
