import { scryptAsync } from "@noble/hashes/scrypt.js";
import { FieldType, Role, WisataKategori } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}

function fromHex(hex: string): Uint8Array {
  return Buffer.from(hex, "hex");
}

/** Hash password dengan format yang sama dengan Better-Auth: salt:scryptHash */
async function hashBetterAuth(password: string): Promise<string> {
  // Better-Auth meng-encode salt ke hex string (bukan raw bytes),
  // lalu salt hex string tsb.yang dilempar ke scryptAsync
  const rawSalt = crypto.getRandomValues(new Uint8Array(16));
  const salt = toHex(rawSalt); // hex string — persis seperti Better-Auth
  const key = await scryptAsync(password.normalize("NFKC"), salt, {
    N: 16384,
    r: 16,
    p: 1,
    dkLen: 64,
    maxmem: 128 * 16384 * 16 * 2,
  });
  return `${salt}:${toHex(key)}`;
}

async function main() {
  console.log("🌱 Seeding database...");

  // --- CLEAN EXISTING DATA ---
  console.log("🧹 Cleaning existing data...");
  await prisma.post.deleteMany();
  await prisma.infografis.deleteMany();
  await prisma.wisata.deleteMany();
  await prisma.uMKM.deleteMany();
  await prisma.perangkatDesa.deleteMany();
  await prisma.desa.deleteMany();
  await prisma.category.deleteMany();
  console.log("✅ Cleaned");

  // --- DESA ---
  const desa = await prisma.desa.upsert({
    where: { id: "desa-padangloang" },
    update: {},
    create: {
      id: "desa-padangloang",
      nama: "Padangloang",
      sejarah: `<p>Desa Padangloang merupakan salah satu desa yang ada pada Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang, atau lebih dikenal dengan nama Kabupaten Sidrap. Sebelum berdiri sebagai Desa, Desa Padangloang merupakan hasil pemekaran dari Kelurahan Lancirang.</p>

<p>Pada tahun 1985 Padangloang terbentuk menjadi Desa persiapan, yang merupakan hasil pemekaran dari Kelurahan Lancirang yang terdiri dari 4 Dusun yaitu Dusun I Padangloang, Dusun II Salonase, Dusun III Lampe'e, Dusun IV Ajubissue. Kepala Desa persiapan di jabat oleh Hade. M pada tahun 1985-1990 yang di tunjuk langsung oleh Bupati Sidenreng Rappang A. Salipolo. SH. Pada tahun 1990-1991 Kepala Desa di gantikan oleh bapak Landikkang dan di tunjuk langsung oleh Bupati, dengan demikian kepemimpinannya hanya dalam masa 1 tahun dikarenakan Desa Padangloang telah di persiapkan menjadi desa definitif.</p>

<p>Pada tahun 1992 Padangloang resmi menjadi Desa definitif dan di tahun yang sama diadakan pemilihan pertama Kepala Desa yang di pilih langsung oleh masyarakat adalah Drs. Muh. Kaseng. AP yang menjabat pada tahun 1992-2005 dan merupakan Kepala Desa yang paling lama masa jabatannya. Pada tahun 1996 Desa Padangloang kembali dimekarkan menjadi 2 Desa yakni Padangloang dan Padangloang Alau yang dusun III Lampe'e masuk di wilayah Desa Padangloang Alau. Kemudian pada tahun 2006 dilakukan pemilihan Kepala Desa dimana pada saat itu yang terpilih kembali adalah Hade. M dan masa kepemimpinannya 2006-2012.</p>

<p>Tahun 2013 di lakukan kembali pemilihan, dan Kepala Desa terpilih adalah Hamsah. P. ST periode 2013-2019, kemudian 2020 dijabat oleh PLT Daris selama 8 bulan dikarenakan beliau juga masuk dalam pemilihan calon Kepala Desa berikutnya, dan pada sisa jabatannya dijabat 4 bulan olah PLT Jufri, kemudian setelahnya diadakan pemilihan untuk periode berikutnya yang terpilih adalah Syamsu Alam yang memimpin Desa Padangloang kedepannya pada 2021-2026.</p>

<h3>Tabel 1. Kepala Desa dan Masa Pemerintahan</h3>

<table>
  <thead>
    <tr><th>NO</th><th>NAMA</th><th>JABATAN</th><th>PERIODE</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>HADE. M</td><td>Kepala Desa</td><td>1985-1990 & 2006-2012</td></tr>
    <tr><td>2</td><td>Drs. MUH. KASENG. AP</td><td>Kepala Desa</td><td>1992-2005</td></tr>
    <tr><td>3</td><td>HAMSAH. P. ST</td><td>Kepala Desa</td><td>2013-2019</td></tr>
    <tr><td>4</td><td>DARIS</td><td>PLT Kades</td><td>Januari - Agustus 2019</td></tr>
    <tr><td>5</td><td>MUH. JUFRI</td><td>PLT Kades</td><td>Oktober 2020 - Januari 2020</td></tr>
    <tr><td>6</td><td>SYAMSU ALAM</td><td>Kepala Desa</td><td>Sekarang</td></tr>
  </tbody>
</table>

<p><em>Sumber: Arsip Desa Padangloang.</em></p>`,
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
  const passwordHash = await hashBetterAuth("admin123");
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
  const editorHash = await hashBetterAuth("editor123");
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

  // --- LAYANAN (TRACKING PELAYANAN) ---
  await prisma.layanan.deleteMany();
  console.log("🧹 Cleaned layanan");

  const layananData = [
    {
      nama: "Pengurusan KTP",
      deskripsi: "Layanan pembuatan/perpanjangan Kartu Tanda Penduduk elektronik untuk warga Desa Padangloang.",
      icon: "CreditCard",
      isActive: true,
      persyaratan: ["Fotokopi Kartu Keluarga", "Fotokopi Surat Pengantar RT", "Pas Foto 2x3 (2 lembar)"],
      formFields: {
        create: [
          { label: "Nama Lengkap", fieldType: FieldType.TEXT, required: true, urutan: 1 },
          { label: "NIK", fieldType: FieldType.TEXT, required: true, urutan: 2, placeholder: "16 digit NIK" },
          { label: "Tempat Lahir", fieldType: FieldType.TEXT, required: true, urutan: 3 },
          { label: "Tanggal Lahir", fieldType: FieldType.DATE, required: true, urutan: 4 },
          { label: "Alamat", fieldType: FieldType.TEXTAREA, required: true, urutan: 5 },
          { label: "Keperluan", fieldType: FieldType.TEXTAREA, required: true, urutan: 6 },
        ],
      },
    },
    {
      nama: "Surat Keterangan Tanah",
      deskripsi: "Layanan pembuatan surat keterangan kepemilikan/penguasaan tanah.",
      icon: "FileText",
      isActive: true,
      persyaratan: ["Fotokopi KTP", "Fotokopi Kartu Keluarga", "Surat Pengantar RT/RW", "Bukti Kepemilikan Tanah (Sertifikat/Girik)"],
      formFields: {
        create: [
          { label: "Nama Pemohon", fieldType: FieldType.TEXT, required: true, urutan: 1 },
          { label: "NIK", fieldType: FieldType.TEXT, required: true, urutan: 2 },
          { label: "Luas Tanah (m²)", fieldType: FieldType.NUMBER, required: true, urutan: 3 },
          { label: "Letak Tanah", fieldType: FieldType.TEXTAREA, required: true, urutan: 4, placeholder: "Dusun, RT/RW" },
          { label: "Jenis Bukti Kepemilikan", fieldType: FieldType.SELECT, required: true, urutan: 5, options: JSON.stringify(["Sertifikat Hak Milik", "Girik", "Letter C", "Akta Jual Beli"]) },
          { label: "Keterangan Tambahan", fieldType: FieldType.TEXTAREA, required: false, urutan: 6 },
        ],
      },
    },
    {
      nama: "Surat Keterangan Domisili",
      deskripsi: "Layanan pembuatan surat keterangan domisili untuk keperluan administrasi warga.",
      icon: "MapPin",
      isActive: true,
      persyaratan: ["Fotokopi KTP", "Fotokopi Kartu Keluarga", "Surat Pengantar RT"],
      formFields: {
        create: [
          { label: "Nama Lengkap", fieldType: FieldType.TEXT, required: true, urutan: 1 },
          { label: "NIK", fieldType: FieldType.TEXT, required: true, urutan: 2 },
          { label: "Alamat Domisili", fieldType: FieldType.TEXTAREA, required: true, urutan: 3 },
          { label: "Sudah Menetap Sejak", fieldType: FieldType.DATE, required: true, urutan: 4 },
          { label: "Keperluan Domisili", fieldType: FieldType.TEXT, required: true, urutan: 5, placeholder: "Contoh: administrasi sekolah" },
        ],
      },
    },
  ];

  for (const l of layananData) {
    await prisma.layanan.create({ data: l });
  }
  console.log(`✅ Layanan: ${layananData.length} layanan dengan form fields`);

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