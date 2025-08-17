import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const AnalyticsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/analytics/applications-stats`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch analytics data');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 text-lg font-medium">
        Loading chart data...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-600 text-lg font-medium">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
        Monthly Applications Analytics
      </h2>

      {/* Chart Container */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 10 }}>
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          {/* Axes */}
          <XAxis
            dataKey="month"
            stroke="#6B7280"
            tick={{ fontSize: 14, fontWeight: 500 }}
            axisLine={{ stroke: '#9CA3AF' }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#6B7280"
            tick={{ fontSize: 14, fontWeight: 500 }}
            axisLine={{ stroke: '#9CA3AF' }}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '8px', border: 'none' }}
            itemStyle={{ color: '#111827', fontWeight: 500 }}
          />

          {/* Legend */}
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}
          />

          {/* Lines */}
          <Line
            type="monotone"
            dataKey="applications"
            stroke="#4F46E5"
            strokeWidth={3}
            activeDot={{ r: 6 }}
            name="Total Applications"
          />
          <Line type="monotone" dataKey="approved" stroke="#16A34A" strokeWidth={3} name="Approved" />
          <Line type="monotone" dataKey="rejected" stroke="#DC2626" strokeWidth={3} name="Rejected" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
