import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionTable.css'; 

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const fetchTransactions = async (searchText = '', currentPage = 1) => {
    try {
      const response = await axios.get('/api/transactions', {
        params: {
          page: currentPage,
          perPage,
          search: searchText,
        },
      });
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions(search, page);
  }, [search, page]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page * perPage < total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container">
      <h2>Transactions</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={handleSearch}
      />

      {/* Transaction Table */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={page * perPage >= total}>
          Next
        </button>
      </div>

      <p>Page {page}</p>
    </div>
  );
}

export default TransactionTable;
