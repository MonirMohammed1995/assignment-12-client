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

  if (loading) return <div className="p-6 text-center text-gray-600">Loading chart data...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Monthly Applications Analytics</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />

          <Line type="monotone" dataKey="applications" stroke="#4F46E5" strokeWidth={2} activeDot={{ r: 8 }} name="Total Applications" />
          <Line type="monotone" dataKey="approved" stroke="#16A34A" strokeWidth={2} name="Approved" />
          <Line type="monotone" dataKey="rejected" stroke="#DC2626" strokeWidth={2} name="Rejected" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
