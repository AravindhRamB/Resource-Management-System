export interface VerticalBarChartProps {
  data: { name: string; value: number }[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  barColor?: string;
  barSize?: number;
}
export interface CustomCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isClickable?: boolean;
  onClick?: () => void;
  
  className?: string;
}
export interface DynamicTableProps {
  data: any[];
  onAccept?: (record: any, index: number) => void;
  onReject?: (record: any, index: number) => void;
  loading?: boolean;
  pagination?: false | import('antd/es/table').TablePaginationConfig;
  size?: 'small' | 'middle' | 'large';
  scroll?: { x?: number; y?: number };
}