import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserHistory = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        console.log('Fetching logs from API...');
        const response = await axios.get('http://localhost:5000/api/logs'); // Ensure the correct URL
        console.log('Logs fetched:', response.data);
        setLogs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch logs', error);
        setLogs([]); // Ensure logs is an array even if the fetch fails
      }
    };

    fetchLogs();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'verified') return 'bg-green-500';
    if (status === 'declined') return 'bg-red-500';
    return 'bg-white';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User History</h2>
      <div>
        {logs.map((log) => (
          <div key={log._id} className={`p-4 mb-4 ${getStatusColor(log.status)} border rounded`}>
            <p>Action: {log.action}</p>
            <p>Timestamp: {new Date(log.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;
