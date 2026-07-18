-- CreateEnum
CREATE TYPE "chart_type" AS ENUM ('BAR_CHART', 'LINE_CHART', 'PIE_CHART', 'DOUGHNUT_CHART', 'AREA_CHART', 'STAT_CARDS');

-- AlterTable
ALTER TABLE "infografis" ADD COLUMN "chartType" "chart_type" NOT NULL DEFAULT 'BAR_CHART';