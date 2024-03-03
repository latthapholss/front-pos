import React, { useState } from 'react';
import axios from 'axios';
import { ADD_PRODUCT, post } from '../Static/api';

function Upload() {
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    description: '',
    category: '',
    unit: '',
    image: '',
  });
  const handleChangeImage = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSaveProduct = async () => {
    // Your existing code...
  
    if (selectedImage) {
      // You can use the FormData API to send the image along with other product data
      let formData = new FormData();
      formData.append("image", selectedImage);
  
      // Add other product data to the formData
      formData.append("product_name", newProduct.name);
      formData.append("product_detail", newProduct.description || "ไม่มีรายละเอียดเพิ่มเติม");
      formData.append("product_cost", newProduct.costPrice);
      formData.append("product_price", newProduct.sellingPrice);
      formData.append("product_qty", newProduct.quantity);
      formData.append("product_type_id", newProduct.category);
      formData.append("unit_id", newProduct.unit);
  
      await post(formData, ADD_PRODUCT).then(async (res) => {
        if (res.success) {
          setNewProduct({
            id: '',
            name: '',
            costPrice: '',
            sellingPrice: '',
            quantity: '',
            description: '',
            category: '',
            unit: '',
            image: null,
          });
          setSelectedImage(null); // Reset the selected image state
          onclose();
          alert(res.message);
        } else {
          alert(res.message);
        }
      });
    } else {
      alert("กรุณาเลือกรูปภาพ");
    }
  };
  
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);
  };
  
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleSaveProduct}>Add Product</button>
    </div>
  );
}

export default Upload;
