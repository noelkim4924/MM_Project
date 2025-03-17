import Log from '../models/Log.js';

// Controller to handle logging actions
export const createLog = async (req, res) => {
  const { user, action, status } = req.body;

  try {
    const newLog = new Log({
      user,
      action,
      status,
      timestamp: new Date()
    });

    await newLog.save();
    res.status(201).json({ message: 'Log created successfully', log: newLog });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create log', error: error.message });
  }
};

// Controller to get all logs
export const getAllLogs = async (req, res) => {
  try {
    console.log('Fetching logs from database...');
    const logs = await Log.find().populate('user').sort({ timestamp: -1 });
    console.log('Logs fetched:', logs);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    res.status(500).json({ message: 'Failed to fetch logs', error: error.message });
  }
};