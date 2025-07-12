import { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios'; 

const UserHistory = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        console.log('Fetching logs from API...');
        const response = await axiosInstance.get('/logs');
        console.log('Logs fetched:', response.data);
        setLogs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch logs', error);
        setLogs([]);
      }
    };

    fetchLogs();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'verified') return 'bg-green-500';
    if (status === 'declined') return 'bg-red-500';
    return 'bg-white';
  };

  const getRoleColor = (role) => {
    if (role === 'mentor') return 'text-blue-700 font-semibold';
    if (role === 'mentee') return 'text-yellow-700 font-semibold';
    if (role === 'admin') return 'text-purple-700 font-semibold';
    return 'text-gray-700';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User History</h2>
      <div>
        {logs.map((log) => (
          <div key={log._id} className={`p-4 mb-4 ${getStatusColor(log.status)} border rounded`}>
            <p>ACTION: <b>{log.action}</b></p>
            {log.user && (
              <div>
                <br />
                <p>
                  User: <b>{log.user.name}</b>
                </p>
                <p>
                  Role:&nbsp;
                  <span className={getRoleColor(log.user.role)}>{log.user.role}</span>
                </p>
                <p>
                  Email: <b>{log.user.email}</b>
                </p>
                <br /> 
              </div>
            )}
            <p className="text-gray-600">Timestamp: {new Date(log.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;