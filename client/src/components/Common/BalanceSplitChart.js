import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "./BalanceSplitChart.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const MIN_VISIBLE_PERCENTAGE = 3;

const BalanceSplitChart = ({ data, variant = "default" }) => {
  // Filter out zero-value accounts
  const nonZeroData = data.filter(item => item.value > 0);
  
  if (nonZeroData.length === 0) {
    return (
      <div className="chart-empty-state">
        <p className="empty-icon">📊</p>
        <p className="empty-title">No account distribution yet</p>
        <p className="empty-description">Add funds to see your breakdown</p>
      </div>
    );
  }

  // Calculate total for percentages
  const total = nonZeroData.reduce((sum, item) => sum + item.value, 0);

  // Prepare data with minimum slice size for visibility
  const chartData = nonZeroData.map(item => {
    const actualPercentage = (item.value / total) * 100;
    return {
      ...item,
      actualValue: item.value,
      actualPercentage,
      // Use minimum percentage for tiny slices (visual only)
      displayValue: actualPercentage < MIN_VISIBLE_PERCENTAGE 
        ? (total * MIN_VISIBLE_PERCENTAGE / 100) 
        : item.value
    };
  });

  // Custom legend with values
  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <div className="chart-legend">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <span 
              className="legend-color" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="legend-label">{entry.value}</span>
            <span className="legend-value">₹{entry.payload.actualValue.toLocaleString()}</span>
            <span className="legend-percent">
              {entry.payload.actualPercentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Custom tooltip
  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-name">{data.name}</p>
          <p className="tooltip-value">₹{data.actualValue.toLocaleString()}</p>
          <p className="tooltip-percent">{data.actualPercentage.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  const chartSize = variant === "dashboard" ? { width: 360, height: 250 } : { width: 280, height: 250 };

  return (
    <div className={`balance-split-chart ${variant}`}>
      <PieChart width={chartSize.width} height={chartSize.height}>
        <Pie
          data={chartData}
          cx={chartSize.width / 2}
          cy={125}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="displayValue"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip content={renderTooltip} />
        <Legend 
          content={renderCustomLegend}
          iconSize={10}
          iconType="circle"
          layout="vertical"
          verticalAlign="middle"
          align="right"
        />
      </PieChart>
    </div>
  );
};

export default BalanceSplitChart;
