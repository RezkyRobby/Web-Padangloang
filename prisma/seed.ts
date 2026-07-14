import { hash } from "bcryptjs";
import { Role, WisataKategori } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // --- DESA ---
  const desa = await prisma.desa.upsert({
    where: { id: "desa-padangloang" },
    update: {},
    create: {
      id: "desa-padangloang",
      nama: "Padangloang",
      sejarah:
        "Desa Padangloang merupakan salah satu desa di Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Desa ini memiliki luas wilayah sekitar 2,75 km² dengan mayoritas penduduk bekerja sebagai petani padi sawah. Kecamatan Dua Pitue dikenal sebagai lumbung pangan utama Sidrap. Selain pertanian, desa ini juga menjadi sentra ayam ras petelur yang menjadi penggerak ekonomi masyarakat.",
      visi: "Terwujudnya Desa Padangloang yang Maju, Mandiri, dan Sejahtera Berbasis Potensi Lokal dan Teknologi Informasi.",
      misi:
        "1. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan\n2. Mengembangkan potensi pertanian dan peternakan secara berkelanjutan\n3. Mendorong pertumbuhan UMKM dan ekonomi kreatif\n4. Meningkatkan kualitas pelayanan publik berbasis digital\n5. Melestarikan nilai-nilai budaya dan kearifan lokal\n6. Membangun infrastruktur desa yang merata dan berkualitas",
      luasWilayah: 2.75,
      jumlahPenduduk: 1599,
      jumlahKK: 561,
      jumlahDusun: 3,
      batasUtara: "Desa Ajubissue (Kec. Pitu Riawa)",
      batasTimur: "Desa Padangloang Alau",
      batasSelatan: "Desa Sumpang Mango (Kec. Pitu Riawa)",
      batasBarat: "Desa Sumpang Mango (Kec. Pitu Riawa)",
    },
  });
  console.log(`✅ Desa: ${desa.nama}`);

  // --- PERANGKAT DESA ---
  const perangkatData = [
    { nama: "H. Muhammad Ali, S.Sos.", jabatan: "Kepala Desa", urutan: 1 },
    { nama: "Andi Syamsul Bahri", jabatan: "Sekretaris Desa", urutan: 2 },
    { nama: "Hj. St. Rahmawati", jabatan: "Kepala Urusan Keuangan", urutan: 3 },
    { nama: "Muhammad Iqbal", jabatan: "Kepala Urusan Perencanaan", urutan: 4 },
    { nama: "Ahmad Yani", jabatan: "Kepala Seksi Kesejahteraan", urutan: 5 },
    { nama: "Rosdiana", jabatan: "Kepala Seksi Pelayanan", urutan: 6 },
  ];

  for (const p of perangkatData) {
    await prisma.perangkatDesa.create({ data: p });
  }
  console.log(`✅ Perangkat Desa: ${perangkatData.length} orang`);

  // --- UMKM ---
  const umkmData = [
    {
      namaProduk: "Beras Premium Padangloang",
      deskripsi: "Beras putih kualitas terbaik hasil panen petani Desa Padangloang. Dibudidayakan secara alami di sawah subur Kecamatan Dua Pitue.",
      harga: "Rp 12.000/kg",
      kategori: "Pertanian",
      kontak: "0821-2345-6789",
      pemilik: "Kelompok Tani Sipakainga",
    },
    {
      namaProduk: "Telur Ayam Ras Segar",
      deskripsi: "Telur ayam ras petelur segar dari peternakan lokal Desa Padangloang. Kaya protein dan bergizi tinggi.",
      harga: "Rp 28.000/rak",
      kategori: "Peternakan",
      kontak: "0821-3456-7890",
      pemilik: "Peternakan Makmur Jaya",
    },
    {
      namaProduk: "Abon Ayam Pedas Manis",
      deskripsi: "Olahan abon ayam khas Desa Padangloang dengan rasa pedas manis yang menggugah selera. Tanpa pengawet.",
      harga: "Rp 35.000/100gr",
      kategori: "Kuliner",
      kontak: "0821-4567-8901",
      pemilik: "Ibu Sitti Hajar",
    },
    {
      namaProduk: "Keripik Pisang Aroma",
      deskripsi: "Keripik pisang renyah dengan berbagai varian rasa: cokelat, keju, dan balado. Produksi rumahan berkualitas.",
      harga: "Rp 15.000/pack",
      kategori: "Kuliner",
      kontak: "0821-5678-9012",
      pemilik: "Mama Aroma Snack",
    },
    {
      namaProduk: "Pupuk Organik Padangloang",
      deskripsi: "Pupuk organik dari kotoran ayam petelur yang diolah secara alami. Meningkatkan kesuburan tanah dan hasil panen.",
      harga: "Rp 25.000/karung",
      kategori: "Pertanian",
      kontak: "0821-6789-0123",
      pemilik: "BUMDes Padangloang",
    },
  ];

  for (const u of umkmData) {
    await prisma.uMKM.create({ data: u });
  }
  console.log(`✅ UMKM: ${umkmData.length} produk`);

  // --- WISATA ---
  const wisataData = [
    {
      nama: "Persawahan Hijau Padangloang",
      deskripsi: "Hamparan sawah hijau yang membentang luas di Desa Padangloang. Cocok untuk wisata fotografi, trekking, dan menikmati sunset khas pedesaan.",
      lokasi: "Dusun 1, Desa Padangloang",
      kategori: WisataKategori.WISATA_ALAM,
    },
    {
      nama: "Kuliner Ayam Petelur Khas Padangloang",
      deskripsi: "Wisata kuliner menikmati olahan telur dan ayam segar langsung dari peternakan lokal. Tersedia berbagai menu tradisional dan modern.",
      lokasi: "Pusat Desa Padangloang",
      kategori: WisataKategori.KULINER,
    },
    {
      nama: "Tradisi Mappadendang",
      deskripsi: "Upacara adat Mappadendang merupakan tradisi syukuran panen padi masyarakat Bugis Sidrap. Dilakukan dengan menumbuk padi bersama-sama diiringi musik tradisional.",
      lokasi: "Lapangan Desa Padangloang",
      kategori: WisataKategori.BUDAYA,
    },
  ];

  for (const w of wisataData) {
    await prisma.wisata.create({ data: w });
  }
  console.log(`✅ Wisata: ${wisataData.length} destinasi`);

  // --- INFO GRAFIS ---
  await prisma.infografis.create({
    data: {
      judul: "Demografi Desa Padangloang",
      tahun: 2026,
      dataJson: {
        jumlahPenduduk: 1599,
        jumlahKK: 561,
        jumlahDusun: 3,
        luasWilayah: 2.75,
        presentaseLakiLaki: 48.5,
        presentasePerempuan: 51.5,
      },
    },
  });

  await prisma.infografis.create({
    data: {
      judul: "Mata Pencaharian Penduduk",
      tahun: 2026,
      dataJson: {
        petani: 65,
        peternak: 15,
        pedagang: 8,
        PNS: 4,
        buruh: 5,
        lainnya: 3,
      },
    },
  });
  console.log(`✅ Infografis: 2 data`);

  // --- CATEGORY ---
  const kabarDesa = await prisma.category.upsert({
    where: { slug: "kabar-desa" },
    update: {},
    create: {
      name: "Kabar Desa",
      slug: "kabar-desa",
      color: "bg-green-100 text-green-700",
    },
  });

  const kegiatan = await prisma.category.upsert({
    where: { slug: "kegiatan" },
    update: {},
    create: {
      name: "Kegiatan",
      slug: "kegiatan",
      color: "bg-blue-100 text-blue-700",
    },
  });

  const pengumuman = await prisma.category.upsert({
    where: { slug: "pengumuman" },
    update: {},
    create: {
      name: "Pengumuman",
      slug: "pengumuman",
      color: "bg-yellow-100 text-yellow-700",
    },
  });
  console.log(`✅ Category: 3 kategori`);

  // --- ADMIN USER ---
  const passwordHash = await hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@padangloang.desa.id" },
    update: {},
    create: {
      id: "admin-utama",
      name: "Admin Desa Padangloang",
      email: "admin@padangloang.desa.id",
      emailVerified: true,
      role: Role.ADMIN,
    },
  });

  // Buat credential untuk login (password: admin123)
  await prisma.account.upsert({
    where: { id: "acc-admin-credential" },
    update: { password: passwordHash },
    create: {
      id: "acc-admin-credential",
      userId: adminUser.id,
      accountId: adminUser.email,
      providerId: "credential",
      password: passwordHash,
    },
  });

  // --- EDITOR USER ---
  const editorHash = await hash("editor123", 10);
  const editorUser = await prisma.user.upsert({
    where: { email: "editor@padangloang.desa.id" },
    update: {},
    create: {
      id: "editor-utama",
      name: "Editor Desa Padangloang",
      email: "editor@padangloang.desa.id",
      emailVerified: true,
      role: Role.EDITOR,
    },
  });

  await prisma.account.upsert({
    where: { id: "acc-editor-credential" },
    update: { password: editorHash },
    create: {
      id: "acc-editor-credential",
      userId: editorUser.id,
      accountId: editorUser.email,
      providerId: "credential",
      password: editorHash,
    },
  });

  console.log(`✅ Admin: ${adminUser.email} / admin123`);
  console.log(`✅ Editor: ${editorUser.email} / editor123`);

  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });