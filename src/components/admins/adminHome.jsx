import React from "react";
import OrdersTable from "./allOrders";
import NavBar from "../header";
import TopSellers from "../users/topSellers";

function AdminDashboard() {
  return (
    <div style={{ overflowX: 'auto'}}>
      <NavBar />
      <section style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1, padding: "10px" }}>
          <OrdersTable />
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </div>
        <div style={{ flex: 1, padding: "10px" ,marginLeft:"-250px" ,marginRight:"150px", marginTop:"40px"}}>
          
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
