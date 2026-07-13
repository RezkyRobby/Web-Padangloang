-- CreateEnum
CREATE TYPE "wisata_kategori" AS ENUM ('WISATA_ALAM', 'KULINER', 'BUDAYA');

-- CreateTable
CREATE TABLE "desa" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "sejarah" TEXT NOT NULL,
    "visi" TEXT NOT NULL,
    "misi" TEXT NOT NULL,
    "luasWilayah" DOUBLE PRECISION,
    "jumlahPenduduk" INTEGER,
    "jumlahKK" INTEGER,
    "jumlahDusun" INTEGER,
    "batasUtara" TEXT,
    "batasTimur" TEXT,
    "batasSelatan" TEXT,
    "batasBarat" TEXT,
    "fotoKepalaDesa" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perangkat_desa" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "foto" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perangkat_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "umkm" (
    "id" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "harga" TEXT,
    "kategori" TEXT NOT NULL,
    "kontak" TEXT NOT NULL,
    "gambar" TEXT,
    "pemilik" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "umkm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wisata" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "kategori" "wisata_kategori" NOT NULL,
    "gambar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wisata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeri" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galeri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infografis" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "dataJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "infografis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "galeri" ADD CONSTRAINT "galeri_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
