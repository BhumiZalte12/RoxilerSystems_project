import React from 'react';
import Statistics from './Statistics'; // Adjust the path if needed
import BarChart from './BarChart'; // Ensure this path is correct

const App = () => {
  return (
    <div>
      <h1>Transaction Dashboard</h1>
      <Statistics />
      <BarChart /> {/* Include the BarChart component */}
      {/* Other components like TransactionTable can go here */}
    </div>
  );
};

export default App; // Ensure this line is present
