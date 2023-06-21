import React from "react";
import NavBar from "../header";
import SalesTable from "./allSales";
import WeeklySalesTable from "./allWeeklySales";

function AdminSales() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "10px" }}>
        <div style={{ flex: 1, padding: "10px", marginRight: "10px", marginTop: "60px" }}>
          <SalesTable />
        </div>
        <div style={{ flex: 1, padding: "10px", marginLeft: "10px" }}>
          <WeeklySalesTable />
        </div>
      </div>
      <div style={{ margin: "0 10px", height: "4px", borderRadius: "2px", backgroundColor: "#ccc" }}></div>
    </div>
  );
}

export default AdminSales;
