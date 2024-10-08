import React, { useEffect, useState } from 'react';  // Import useState for state management
import { Bar } from 'react-chartjs-2';  // Ensure the chart is imported correctly

const BarChart = () => {
  const [chartData, setChartData] = useState(null);  // State to hold chart data
  const [error, setError] = useState(false);  // State to handle error

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Updated API endpoint to fetch bar chart data for February
        const response = await fetch(`/api/bar-chart-data?month=February`);
        const data = await response.json();
        console.log(data);  // Log the data to the console to verify it

        // Assuming the API returns an array of objects with priceRange and count
        const labels = data.map(item => item.priceRange);
        const values = data.map(item => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Sales',
              data: values,
              backgroundColor: 'rgba(75,192,192,0.4)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError(true);  // Set error to true if API call fails
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>Error fetching statistics</p>;  // Show this if there's an error
  }

  if (!chartData) {
    return <p>Loading...</p>;  // Show loading if data hasn't arrived yet
  }

  return (
    <div>
      <h2>Bar Chart Stats - February</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
