-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "careers" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "duracion" VARCHAR(50) NOT NULL,
    "modalidad" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "career_id" BIGINT NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_routes" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "career_id" BIGINT NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "progreso" DECIMAL(5,2) NOT NULL DEFAULT 0,

    CONSTRAINT "learning_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "intereses" VARCHAR(255) NOT NULL,
    "habilidades" VARCHAR(255) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "career_id" BIGINT NOT NULL,
    "puntaje" DECIMAL(5,2) NOT NULL,
    "resultado" VARCHAR(100) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_answers" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "question_id" BIGINT NOT NULL,
    "respuesta" VARCHAR(255) NOT NULL,

    CONSTRAINT "test_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_questions" (
    "id" BIGSERIAL NOT NULL,
    "enunciado" TEXT NOT NULL,
    "categoria" VARCHAR(100) NOT NULL,

    CONSTRAINT "test_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "email" VARCHAR(180) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "careers_nombre_key" ON "careers"("nombre");

-- CreateIndex
CREATE INDEX "idx_favorites_career_id" ON "favorites"("career_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_favorites_user_career" ON "favorites"("user_id", "career_id");

-- CreateIndex
CREATE INDEX "idx_learning_routes_career_id" ON "learning_routes"("career_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_learning_routes_user_career" ON "learning_routes"("user_id", "career_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "idx_recommendations_career_id" ON "recommendations"("career_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_recommendations_user_career" ON "recommendations"("user_id", "career_id");

-- CreateIndex
CREATE INDEX "idx_test_answers_question_id" ON "test_answers"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_test_answers_user_question" ON "test_answers"("user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_routes" ADD CONSTRAINT "learning_routes_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_routes" ADD CONSTRAINT "learning_routes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "test_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;


-- Restricción del puntaje de recomendaciones
ALTER TABLE "recommendations"
ADD CONSTRAINT "recommendations_puntaje_check"
CHECK ("puntaje" >= 0 AND "puntaje" <= 100);

-- Restricción del progreso de rutas de aprendizaje
ALTER TABLE "learning_routes"
ADD CONSTRAINT "learning_routes_progreso_check"
CHECK ("progreso" >= 0 AND "progreso" <= 100);



-- Habilitar Row Level Security (RLS)
ALTER TABLE "careers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "favorites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learning_routes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recommendations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "test_answers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "test_questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

