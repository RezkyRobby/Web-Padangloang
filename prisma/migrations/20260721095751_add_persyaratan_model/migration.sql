/*
  Warnings:

  - You are about to drop the column `persyaratan` on the `layanan` table. All the data in the column will be lost.
  - You are about to drop the column `templateFile` on the `layanan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "layanan" DROP COLUMN "persyaratan",
DROP COLUMN "templateFile";

-- CreateTable
CREATE TABLE "persyaratan" (
    "id" TEXT NOT NULL,
    "layananId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "contohGambar" TEXT,
    "templateFile" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persyaratan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "persyaratan_layananId_idx" ON "persyaratan"("layananId");

-- AddForeignKey
ALTER TABLE "persyaratan" ADD CONSTRAINT "persyaratan_layananId_fkey" FOREIGN KEY ("layananId") REFERENCES "layanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
