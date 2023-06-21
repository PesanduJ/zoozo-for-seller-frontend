import React from "react";
import ProductsTable from "./allProducts";
import CreateProductForm from "./createProduct";
import "../../styles/adminProducts.css";
import NavBar from "../header";

function AdminProducts() {
  return (
    <div style={{ overflowX: 'auto'}}>
      <NavBar />
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flex: 1, padding: "20px", marginLeft: "10px"}}>
          <CreateProductForm />
        </div>
        <div style={{ flex: 2, padding: "20px", marginLeft: "-2 s50px", marginRight:"50px"}}>
          <div style={{ marginBottom: "20px" }}>
            <ProductsTable />
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
