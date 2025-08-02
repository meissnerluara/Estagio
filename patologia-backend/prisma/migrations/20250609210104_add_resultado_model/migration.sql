-- CreateTable
CREATE TABLE "Resultado" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "questionarioId" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resultado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resultado_alunoId_questionarioId_key" ON "Resultado"("alunoId", "questionarioId");

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "Questionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
