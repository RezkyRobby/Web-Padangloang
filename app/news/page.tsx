import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CategoryBadge } from "@/components/custom/category-badge";
import type { NewsCardPost } from "@/components/custom/news-card";

type PageProps = {
  searchParams: Promise<{ q?: string; categoryId?: string; page?: string }>;
};

function formatDate(iso: Date) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

async function getPosts(params: {
  q?: string;
  categoryId?: string;
  page: number;
}) {
  const limit = 9;
  const skip = (params.page - 1) * limit;

  const where = {
    published: true,
    ...(params.q ? { title: { contains: params.q, mode: "insensitive" as const } } : {}),
    ...(params.categoryId ? { categoryId: params.categoryId } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        category: { select: { id: true, name: true, color: true } },
        authors: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const mapped: NewsCardPost[] = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.summary ?? undefined,
    category: {
      name: post.category?.name ?? "Umum",
      color: post.category?.color,
    },
    author: post.authors[0]?.name ?? "Redaksi",
    authorAvatar: post.authors[0]?.image ?? undefined,
    date: formatDate(post.createdAt),
    image: post.image ?? `https://picsum.photos/seed/${post.slug}/800/500`,
  }));

  return { posts: mapped, totalPages, total };
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const categoryId = params.categoryId?.trim() ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const [categories, { posts, totalPages, total }] = await Promise.all([
    getCategories(),
    getPosts({ q, categoryId, page }),
  ]);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#282834] via-[#1e1e28] to-[#282834] pt-24 md:pt-28">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Berita Desa Padangloang
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
              Informasi terbaru seputar kegiatan pembangunan, pemberdayaan masyarakat, dan berbagai aktivitas di Desa Padangloang, Kec. Dua Pitue, Kab. Sidenreng Rappang.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8">
        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <form method="GET" action="/news" className="relative w-full sm:max-w-xs">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari berita..."
              className="w-full rounded-xl border border-[#dee2de] bg-white px-4 py-2.5 pl-10 text-sm text-[#282834] outline-none transition-colors placeholder:text-[#282834]/40 focus:border-[#282834]/30 dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-white/40"
            />
            <svg
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#282834]/40 dark:text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {q && (
              <Link
                href="/news"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#282834]/50 hover:text-[#282834] dark:text-white/50 dark:hover:text-white"
              >
                ✕
              </Link>
            )}
          </form>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/news"
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                !categoryId
                  ? "bg-[#282834] text-white dark:bg-white dark:text-[#282834]"
                  : "bg-[#f9faf7] text-[#282834] hover:bg-[#e2e5e0] dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
              }`}
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/news?categoryId=${cat.id}`}
                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  categoryId === cat.id
                    ? "bg-[#282834] text-white dark:bg-white dark:text-[#282834]"
                    : "bg-[#f9faf7] text-[#282834] hover:bg-[#e2e5e0] dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Berita Grid */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-[#f9faf7] p-6 dark:bg-[#2a2a2a]">
              <svg className="size-10 text-[#282834]/30 dark:text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#282834] dark:text-white">Belum ada berita</h3>
            <p className="mt-1 text-sm text-[#282834]/60 dark:text-white/60">
              {q ? `Tidak ditemukan berita dengan kata kunci "${q}"` : "Belum ada berita yang dipublikasikan."}
            </p>
            {q && (
              <Link href="/news" className="mt-4 text-sm font-semibold text-[#282834] underline dark:text-white">
                Reset pencarian
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-2 text-sm text-[#282834]/60 dark:text-white/60">
              Menampilkan {posts.length} dari {total} berita
              {q && <> untuk "{q}"</>}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="group block">
                  <article className="overflow-hidden rounded-xl border border-[#dee2de] bg-white transition hover:border-[#282834]/30 dark:border-[#414943] dark:bg-[#1a1a1a] dark:hover:border-white/30">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3">
                        <CategoryBadge
                          name={post.category.name}
                          color={post.category.color}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <time className="text-[11px] font-medium text-[#282834]/50 dark:text-white/50">
                        {post.date}
                      </time>
                      <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#282834] transition-colors group-hover:text-[#282834]/70 dark:text-white dark:group-hover:text-white/70">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#282834]/60 dark:text-white/60">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#282834]/40 dark:text-white/40">
                        <span>{post.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          Baca selengkapnya
                          <ChevronRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/news?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}${categoryId ? `&categoryId=${categoryId}` : ""}`}
                    className="flex items-center gap-1 rounded-lg border border-[#dee2de] bg-white px-4 py-2 text-[13px] font-semibold text-[#282834] transition hover:bg-[#f9faf7] dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#2a2a2a]"
                  >
                    ← Sebelumnya
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/news?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}${categoryId ? `&categoryId=${categoryId}` : ""}`}
                    className={`flex size-10 items-center justify-center rounded-lg text-[13px] font-semibold transition ${
                      p === page
                        ? "bg-[#282834] text-white dark:bg-white dark:text-[#282834]"
                        : "border border-[#dee2de] bg-white text-[#282834] hover:bg-[#f9faf7] dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#2a2a2a]"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={`/news?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}${categoryId ? `&categoryId=${categoryId}` : ""}`}
                    className="flex items-center gap-1 rounded-lg border border-[#dee2de] bg-white px-4 py-2 text-[13px] font-semibold text-[#282834] transition hover:bg-[#f9faf7] dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#2a2a2a]"
                  >
                    Selanjutnya →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}