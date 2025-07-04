import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const ProductFilter = ({ categories,person, selectedCategory, onSelectCategory }) => {
  React.useEffect(() => {
    // เมื่อโหลดหน้า CashierPage ต้องตั้งค่า selectedCategory เป็นค่าเริ่มต้นที่สอดคล้องกับตัวเลือก
    if (selectedCategory === '' && categories.length > 0) {
      onSelectCategory({ target: { value: categories[0] } });
    }
  }, [categories, selectedCategory, onSelectCategory]);

  return (
    <div className="product-filter">
      <TextField
        select
        label=""
        value={selectedCategory}
        onChange={onSelectCategory}
        variant="outlined"
        fullWidth
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default ProductFilter;
