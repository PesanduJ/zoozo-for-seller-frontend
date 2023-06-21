import React, { useState } from "react";
import { Button, Form, Dimmer, Loader } from "semantic-ui-react";
import axios from "axios";
import "../../styles/createProduct.css";

function CreateProductForm() {
  const [loading, setLoading] = useState(false);
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [inStock, setInStock] = useState("");
  const [productValue, setProductValue] = useState("");
  const [image, setImage] = useState(null);

  async function postData(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("productCode", productCode);
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("sellingPrice", sellingPrice);
      formData.append("inStock", inStock);
      formData.append("productValue", productValue);
      formData.append("file", image); // Append the image file
  
      const productJson = JSON.stringify({
        productCode,
        productName,
        description,
        sellingPrice,
        inStock,
        productValue,
      });
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/admin/addProduct`,
        formData,
        {
          params: { product: productJson }, // Include the 'product' parameter
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          auth: {
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
          },
        }
      );
  
      if (response.status === 200) {
        alert("Product Created Successfully!");
        setProductCode("");
        setProductName("");
        setDescription("");
        setSellingPrice("");
        setInStock("");
        setProductValue("");
        setImage(null);
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }
  

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const options = [
    { key: "yes", text: "Yes", value: "YES" },
    { key: "no", text: "No", value: "NO" },
  ];

  return (
    <div>
      <h3>Create Product</h3>
      <div className="create-product-form">
        <Form>
          <Form.Field>
            <label>Product Code</label>
            <input
              placeholder="Product Code"
              onChange={(e) => setProductCode(e.target.value)}
            />
          </Form.Field>

          <Form.Field>
            <label>Product Name</label>
            <input
              placeholder="Product Name"
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Field>

          <Form.Field>
            <label>Description</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </Form.Field>

          <Form.Field>
            <label>Selling Price</label>
            <input
              placeholder="Selling Price"
              type="number"
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </Form.Field>

          <Form.Field>
            <label>In Stock</label>
            <Form.Select
              placeholder="In Stock"
              options={options}
              value={inStock}
              onChange={(e, { value }) => setInStock(value)}
            />
          </Form.Field>

          <Form.Field>
            <label>Product Value</label>
            <input
              placeholder="Product Value"
              type="number"
              onChange={(e) => setProductValue(e.target.value)}
            />
          </Form.Field>

          <Form.Field>
            <label>Image</label>
            <input type="file" onChange={handleImageChange} />
          </Form.Field>

          <Button type="submit" onClick={postData} disabled={loading}>
            {loading ? (
              <Dimmer active inverted>
                <Loader>Processing</Loader>
              </Dimmer>
            ) : (
              "Create Product"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default CreateProductForm;
