import React from "react";
import CameraFeed from "./CameraFeed";
import AttendanceTable from "./AttendanceTable";

const Layout = () => {
  return (
    <div className="layout">
      <div className="box camera-box">
        <h2>Live Camera</h2>
        <CameraFeed />
      </div>
      <div className="box attendance-box">
        <h2>Attendance Records</h2>
        <AttendanceTable />
      </div>
    </div>
  );
};

export default Layout;
