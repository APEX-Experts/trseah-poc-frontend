"use client";

import { DonutChart } from "@/components/ui/charts/donut-chart";
import { AvailableChartColorsKeys } from "@/lib/chart-utils";

interface DaysLeftProgressProps {
  remainingDays: number;
  percent: number;
  locale: string;
}

export default function DaysLeftProgress({
  remainingDays,
  percent,
  locale,
}: DaysLeftProgressProps) {
  let color = "chart-1";

  if (percent < 20) {
    color = "error";
  } else if (percent < 50) {
    color = "warning";
  }

  const data = [
    {
      name: "progress",
      value: percent,
    },
    {
      name: "remaining",
      value: 100 - percent,
    },
  ];

  return (
    <div className="relative flex items-center justify-center">
      <DonutChart
        className="h-[72px] w-[72px]"
        data={data}
        category="name"
        value="value"
        showTooltip={false}
        showLabel={false}
        colors={[color as AvailableChartColorsKeys, "chart-2"]}
      />

      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-base font-bold text-primary-900 leading-none">{remainingDays}</span>

        <span className="mt-0.5 text-[9px] font-medium text-neutral-500">
          {locale === "ar" ? "يوم" : remainingDays === 1 ? "day" : "days"}
        </span>
      </div>
    </div>
  );
}
