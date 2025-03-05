import React, { useState, useEffect } from "react";

const AttendanceTable = () => {
  // Generate UID helper function
  const generateUID = () => {
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `RU${random}`;
  };

  const [records, setRecords] = useState([
    { id: 1, name: "John Doe", uid: "RU230463", status: "IN", timestamp: "10:00 AM" },
    { id: 2, name: "Jane Smith", uid: "RU230464", status: "OUT", timestamp: "11:30 AM" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRecord = {
        id: records.length + 1,
        name: `User ${records.length + 1}`,
        uid: generateUID(),
        status: Math.random() > 0.5 ? "IN" : "OUT",
        timestamp: new Date().toLocaleTimeString(),
      };

      setRecords((prevRecords) => [newRecord, ...prevRecords]);
    }, 5000);

    return () => clearInterval(interval);
  }, [records]);

  return (
    <div className="attendance-wrapper">
      <h2 className="attendance-title">Attendance Records</h2>
      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>UID</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.name}</td>
                <td><span className="uid-badge">{record.uid}</span></td>
                <td>
                  <span className={`status-badge ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
                <td>{record.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
