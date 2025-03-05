import React from "react";
import CameraFeed from "./components/CameraFeed";
import AttendanceTable from "./components/AttendanceTable";
import "./styles/styles.css";

const App = () => {
  return (
    <div className="container">
      <div className="camera-section">
        <h2 className="camera-title">Live Camera</h2>
        <CameraFeed />
      </div>
      <div className="attendance-section">
        <AttendanceTable />
      </div>
    </div>
  );
};

export default App;
