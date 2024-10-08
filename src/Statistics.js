import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Statistics.css';

const Statistics = ({ selectedMonth }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/statistics?month=${selectedMonth}`);
        setStats(response.data);
      } catch (err) {
        setError('Error fetching statistics');
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      {stats && (
        <div>
          <h3>Statistics - {selectedMonth}</h3>
          <div>Total Sale: {stats.totalSale}</div>
          <div>Total Sold Items: {stats.totalSoldItems}</div>
          <div>Total Not Sold Items: {stats.totalNotSoldItems}</div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
