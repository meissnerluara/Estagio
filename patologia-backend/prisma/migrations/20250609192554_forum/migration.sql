/*
  Warnings:

  - You are about to drop the `MensagemForum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RespostaForum` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RespostaForum" DROP CONSTRAINT "RespostaForum_mensagemId_fkey";

-- DropTable
DROP TABLE "MensagemForum";

-- DropTable
DROP TABLE "RespostaForum";
