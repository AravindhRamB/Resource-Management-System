import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { VerticalBarChartProps } from "@/module/component";

export default function VerticalBarChart({
  data,
  xAxisLabel,
  yAxisLabel,
  barColor = "#8884d8",
  barSize,
}: VerticalBarChartProps) {
  // Calculate dynamic barSize based on data length
  const dynamicBarSize = barSize ?? (data && data.length > 0 ? Math.max(10, 90 / data.length) : 20);

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            label={{ value: xAxisLabel, position: "insideBottom", offset: -5 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Bar dataKey="value" fill={barColor} barSize={dynamicBarSize} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}