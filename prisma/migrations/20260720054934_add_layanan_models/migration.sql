-- CreateEnum
CREATE TYPE "status_permohonan" AS ENUM ('MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK', 'DITANGGUHKAN', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "jenis_ajuan" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "field_type" AS ENUM ('TEXT', 'NUMBER', 'TEXTAREA', 'DATE', 'FILE_UPLOAD', 'SELECT', 'RADIO', 'CHECKBOX');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "nik" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- CreateTable
CREATE TABLE "layanan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hanyaOffline" BOOLEAN NOT NULL DEFAULT false,
    "persyaratan" JSONB,
    "templateFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "layanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_field" (
    "id" TEXT NOT NULL,
    "layananId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fieldType" "field_type" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" TEXT,
    "options" JSONB,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permohonan" (
    "id" TEXT NOT NULL,
    "nomorTiket" TEXT NOT NULL,
    "layananId" TEXT,
    "userId" TEXT NOT NULL,
    "jenisAjuan" "jenis_ajuan" NOT NULL,
    "status" "status_permohonan" NOT NULL DEFAULT 'MENUNGGU',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permohonan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permohonan_data" (
    "id" TEXT NOT NULL,
    "permohonanId" TEXT NOT NULL,
    "formFieldId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "permohonan_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_history" (
    "id" TEXT NOT NULL,
    "permohonanId" TEXT NOT NULL,
    "status" "status_permohonan" NOT NULL,
    "catatan" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permohonan_nomorTiket_key" ON "permohonan"("nomorTiket");

-- CreateIndex
CREATE INDEX "permohonan_userId_idx" ON "permohonan"("userId");

-- CreateIndex
CREATE INDEX "permohonan_data_permohonanId_idx" ON "permohonan_data"("permohonanId");

-- CreateIndex
CREATE INDEX "progress_history_permohonanId_idx" ON "progress_history"("permohonanId");

-- AddForeignKey
ALTER TABLE "form_field" ADD CONSTRAINT "form_field_layananId_fkey" FOREIGN KEY ("layananId") REFERENCES "layanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permohonan" ADD CONSTRAINT "permohonan_layananId_fkey" FOREIGN KEY ("layananId") REFERENCES "layanan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permohonan" ADD CONSTRAINT "permohonan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permohonan_data" ADD CONSTRAINT "permohonan_data_permohonanId_fkey" FOREIGN KEY ("permohonanId") REFERENCES "permohonan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permohonan_data" ADD CONSTRAINT "permohonan_data_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "form_field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_history" ADD CONSTRAINT "progress_history_permohonanId_fkey" FOREIGN KEY ("permohonanId") REFERENCES "permohonan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_history" ADD CONSTRAINT "progress_history_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
