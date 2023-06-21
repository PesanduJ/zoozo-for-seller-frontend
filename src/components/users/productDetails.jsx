import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { productCode } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/product/${productCode}`,
      {
        withCredentials: true,
        auth: {
          username: localStorage.getItem("username"),
          password: localStorage.getItem("password"),
        },
      });
      const data = await response.data;
      setProduct(data);
      console.log(data.imageKey);
      console.log(data.productCode);
      console.log(data.productName);
      console.log(data.sellingPrice);
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product Details</h1>
      <div>ID: {product.productCode}</div>
      <div>Name: {product.productName}</div>
      <div>Price: {product.sellingPrice}</div>
      <img src={product.imageKey} alt={product.productName} />
    </div>
  );
};

export default ProductDetails;
