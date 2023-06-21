import React, { useState, useEffect } from 'react';
import { Form, Button, Dimmer, Loader } from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/updateProduct.css';

function UpdateProduct() {
  const { productCode } = useParams();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [inStock, setInStock] = useState('');
  const [productValue, setProductValue] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/product/${productCode}`, {
          withCredentials: true,
          auth: {
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password'),
          },
        });
        const data = response.data;
        setProductName(data.productName);
        setDescription(data.description);
        setSellingPrice(data.sellingPrice);
        setInStock(data.inStock);
        setProductValue(data.productValue);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productCode]);

  const handleUpdate = () => {
    setLoading(true);

    const updatedProduct = {
      productName,
      description,
      sellingPrice,
      inStock,
      productValue,
    };

    axios
      .put(`${process.env.REACT_APP_API_HOST}/api/admin/product/${productCode}`, updatedProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password'),
        },
      })
      .then((response) => {
        setLoading(false);
        alert('Product updated successfully!');
        navigate('/products');
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        alert('Failed to update the product.');
      });
  };

  const options = [
    { value: 'YES', text: 'Yes' },
    { value: 'NO', text: 'No' },
    // Add more options as needed
  ];

  return (
    <div className="update-form">
      <h3>Update Product Details</h3>
      <div className="update-product-form">
        <Form>
          <Form.Field>
            <label>Product Name</label>
            <input
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={loading}
            />
          </Form.Field>

          <Form.Field>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            ></textarea>
          </Form.Field>

          <Form.Field>
            <label>Selling Price</label>
            <input
              placeholder="Selling Price"
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              disabled={loading}
            />
          </Form.Field>

          <Form.Field>
            <label>In Stock</label>
            <Form.Select
              placeholder="In Stock"
              options={options}
              value={inStock}
              onChange={(e, { value }) => setInStock(value)}
              disabled={loading}
            />
          </Form.Field>

          <Form.Field>
            <label>Product Value</label>
            <input
              placeholder="Product Value"
              type="number"
              value={productValue}
              onChange={(e) => setProductValue(e.target.value)}
              disabled={loading}
            />
          </Form.Field>

          <Button type="submit" onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <Dimmer active inverted>
                <Loader>Processing</Loader>
              </Dimmer>
            ) : (
              'Update Product'
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default UpdateProduct;
