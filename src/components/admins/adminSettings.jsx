import React from "react";
import AdminsTable from "./allAdmins";
import AdminForm from "./createAdmin";
import UsersTable from "./allUsers";
import "../../styles/adminSettings.css";
import NavBar from "../header";

function AdminSettings() {
  return (
    <div style={{ overflowX: 'auto'}}>
      <NavBar />

      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flex: 1, padding: "20px", marginLeft: "10px"}}>
          <AdminForm />
        </div>
        <div style={{ flex: 2, padding: "20px", marginLeft: "-2 s50px", marginRight:"50px"}}>
          <div style={{ marginBottom: "20px" }}>
            <AdminsTable />
          </div>
          <div>
            <UsersTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
