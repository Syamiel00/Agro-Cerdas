import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the type for our data
type ChartData = {
  name: string;
  value: number;
};

// Sample data for the chart
const data: ChartData[] = [
  { name: 'Page A', value: 400 },
  { name: 'Page B', value: 300 },
  { name: 'Page C', value: 200 },
  { name: 'Page D', value: 278 },
  { name: 'Page E', value: 189 },
];

const BarChartComponent: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line dataKey="value" fill="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;