import { z } from "zod";

export const CHART_TYPES = [
  "BAR_CHART",
  "LINE_CHART",
  "PIE_CHART",
  "DOUGHNUT_CHART",
  "AREA_CHART",
  "STAT_CARDS",
] as const;

export const chartTypeSchema = z.enum(CHART_TYPES);

export type ChartType = z.infer<typeof chartTypeSchema>;

export const CHART_TYPE_LABELS: Record<ChartType, string> = {
  BAR_CHART: "Diagram Batang",
  LINE_CHART: "Diagram Garis",
  PIE_CHART: "Diagram Pie",
  DOUGHNUT_CHART: "Diagram Donat",
  AREA_CHART: "Diagram Area",
  STAT_CARDS: "Kartu Statistik",
};

export const CHART_TYPE_ICONS: Record<ChartType, string> = {
  BAR_CHART: "BarChart3",
  LINE_CHART: "TrendingUp",
  PIE_CHART: "PieChart",
  DOUGHNUT_CHART: "ChartDonut",
  AREA_CHART: "AreaChart",
  STAT_CARDS: "LayoutGrid",
};

// Prisma Json type bisa berupa object, array, string, number, boolean, null
export const createInfografisSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  tahun: z
    .number()
    .int("Tahun harus bilangan bulat")
    .positive("Tahun harus positif"),
  dataJson: z.any(),
  chartType: chartTypeSchema.default("BAR_CHART"),
});

export type CreateInfografisInput = z.infer<typeof createInfografisSchema>;

export const updateInfografisSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").optional(),
  tahun: z
    .number()
    .int("Tahun harus bilangan bulat")
    .positive("Tahun harus positif")
    .optional(),
  dataJson: z.any().optional(),
  chartType: chartTypeSchema.optional(),
});

export type UpdateInfografisInput = z.infer<typeof updateInfografisSchema>;
export type CreateInfografisFormErrors = Partial<
  Record<keyof CreateInfografisInput, string[]>
>;
