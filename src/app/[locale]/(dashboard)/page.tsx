"use client";
import {
  AreaChartWidget,
  BarChartWidget,
  BarListWidget,
  CategoryBarWidget,
  ComboChartWidget,
  DashboardGrid,
  DonutChartWidget,
  KpiCard,
  LineChartWidget,
  ProgressBarWidget,
  ProgressCircleWidget,
  SparkChartWidget,
  TrackerWidget,
  DataTableWidget,
} from "@/components/dashboard";
import { Activity, Clock, CreditCard, DollarSign } from "lucide-react";
import {
  revenueData,
  categoryData,
  trafficData,
  referrerData,
  sessionData,
  marketingData,
  statusData,
  sparkData,
  riskData,
  sessionColumns,
  kpiData,
} from "@/lib/mockData";
import { useTranslations } from "next-intl";

const iconMap = {
  DollarSign,
  CreditCard,
  Activity,
  Clock,
};

const DashboardPage = () => {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("overview")}</h1>
        <p className="text-muted-foreground">{t("welcomeBackMsg")}</p>
      </div>

      <DashboardGrid>
        {/* Row 1: KPI Cards */}
        {kpiData.map((kpi) => {
          const Icon = iconMap[kpi.icon as keyof typeof iconMap];
          return (
            <KpiCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              icon={<Icon className="size-4" />}
            />
          );
        })}

        {/* Row 2: Main Charts */}
        <AreaChartWidget
          span={2}
          title={t("revenueGrowth")}
          description={t("revenueDesc")}
          data={revenueData}
          categories={["Revenue", "Target"]}
          colors={["chart-1", "chart-2"]}
          valueFormatter={(number) => `$${Intl.NumberFormat("us").format(number).toString()}`}
        />

        <BarChartWidget
          span={2}
          title={t("salesCategory")}
          description={t("salesDesc")}
          data={categoryData}
          categories={["Sales"]}
          colors={["chart-3"]}
        />

        {/* Row 3: Mixed Charts */}
        <DonutChartWidget
          span={1}
          title={t("trafficSource")}
          description={t("trafficDesc")}
          data={trafficData}
          value="value"
          colors={["chart-1", "chart-2", "chart-3", "chart-4"]}
        />

        <BarListWidget
          span={1}
          title={t("topReferrers")}
          description={t("topReferrersDesc")}
          data={referrerData}
          valueFormatter={(value) => `${value} visits`}
        />

        <LineChartWidget
          span={2}
          title={t("activeSessions")}
          description={t("activeSessionsDesc")}
          data={sessionData}
          categories={["Users", "Sessions"]}
          colors={["chart-4", "chart-5"]}
        />

        {/* Row 4: Advanced Widgets */}
        <ComboChartWidget
          span={2}
          title={t("marketingRoi")}
          description={t("marketingRoiDesc")}
          data={marketingData}
          barSeries={{
            categories: ["Spend"],
            colors: ["chart-1"],
            valueFormatter: (v) => `$${v}`,
          }}
          lineSeries={{
            categories: ["Conversions"],
            colors: ["chart-2"],
          }}
          enableBiaxial
        />

        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBarWidget
            title={t("quarterlyGoal")}
            description={t("quarterlyGoalDesc")}
            value={75}
            label="75%"
            variant="success"
            mdSpan={2}
          />
          <CategoryBarWidget
            title={t("riskAssessment")}
            description={t("riskAssessmentDesc")}
            data={riskData}
            colors={["chart-2", "chart-3", "chart-4", "chart-5"]}
            marker={{ value: 65, tooltip: "Current: Moderate Risk" }}
            mdSpan={2}
          />
        </div>
        <ProgressCircleWidget
          title={t("uptime")}
          value={99.9}
          radius={40}
          mdSpan={1}
          span={1}
          variant="success"
        />
        <ProgressCircleWidget
          title={t("errorRate")}
          value={0.5}
          max={5}
          radius={40}
          variant="error"
          span={1}
          mdSpan={1}
        />

        {/* Row 5: Status & Loading Examples */}
        <TrackerWidget
          span={2}
          mdSpan={2}
          title={t("serviceStatus")}
          description={t("serviceStatusDesc")}
          data={statusData}
        />

        <SparkChartWidget
          span={2}
          title={t("quickTrend")}
          description={t("quickTrendDesc")}
          data={sparkData}
          variant="area"
          colors={["chart-1"]}
          mdSpan={2}
        />

        <DataTableWidget
          span={2}
          mdSpan={2}
          title={t("sessionDetails")}
          description={t("sessionDetailsDesc")}
          data={sessionData}
          columns={sessionColumns}
        />
      </DashboardGrid>
    </div>
  );
};

export default DashboardPage;
