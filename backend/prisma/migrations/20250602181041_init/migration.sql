-- CreateTable
CREATE TABLE "questions" (
    "question_id" SERIAL NOT NULL,
    "stage_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "answer" VARCHAR(255) NOT NULL,
    "hint1" BYTEA,
    "hint2" BYTEA,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "stages" (
    "stage_id" SERIAL NOT NULL,
    "stage_number" INTEGER NOT NULL,
    "stage_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "open_code" VARCHAR(255),
    "location_image" BYTEA,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("stage_id")
);

-- CreateTable
CREATE TABLE "team_question_assignments" (
    "assignment_id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "stage_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(6),
    "attempts" INTEGER DEFAULT 0,
    "last_attempt_at" TIMESTAMP(6),

    CONSTRAINT "team_question_assignments_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "team_routes" (
    "team_route_id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "stage_id" INTEGER NOT NULL,
    "route_order" INTEGER NOT NULL,
    "completed" BOOLEAN DEFAULT false,
    "start_at" TIMESTAMP(6),
    "completed_at" TIMESTAMP(6),
    "open_code_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_routes_pkey" PRIMARY KEY ("team_route_id")
);

-- CreateTable
CREATE TABLE "teams" (
    "team_id" SERIAL NOT NULL,
    "team_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "current_stage_id" INTEGER DEFAULT 1,
    "start_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_team_route" ON "team_routes"("team_id", "route_order");

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_name_key" ON "teams"("team_name");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "fk_stage" FOREIGN KEY ("stage_id") REFERENCES "stages"("stage_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_question_assignments" ADD CONSTRAINT "fk_question_assignment" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_question_assignments" ADD CONSTRAINT "fk_stage_assignment" FOREIGN KEY ("stage_id") REFERENCES "stages"("stage_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_question_assignments" ADD CONSTRAINT "fk_team_assignment" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_routes" ADD CONSTRAINT "fk_route_stage" FOREIGN KEY ("stage_id") REFERENCES "stages"("stage_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_routes" ADD CONSTRAINT "fk_team" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE CASCADE ON UPDATE NO ACTION;
