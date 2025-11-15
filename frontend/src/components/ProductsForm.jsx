export default function ProductsForm({
  productName,
  brand,
  price,
  image,
  quantity,
  unit,
  isEditMode,
  handleCancel,
  handleOnChange,
  handleOnSubmit,
}) {
  // Modal form to add new products
  return (
    <div className="ProductsForm">
      <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleOnSubmit}>
        <div className="form-group">
          <label>
            Product Name: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={handleOnChange}
            required
            placeholder="Enter product name"
          />
        </div>
        <div className="form-group">
          <label>
            Brand: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="brand"
            value={brand}
            onChange={handleOnChange}
            required
            placeholder="Enter brand name"
          />
        </div>
        <div className="form-group">
          <label>
            Price:
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="price"
            value={price}
            onChange={handleOnChange}
            required
            placeholder="Enter price"
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={image}
            onChange={handleOnChange}
            placeholder="Enter image URL"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="form-group">
            <label>
              Available Quantity: <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="quantity"
              value={quantity}
              onChange={handleOnChange}
              required
              placeholder="Enter quantity"
            />
          </div>
          <div className="form-group">
            {/* I added this input just for fun*/}
            <label htmlFor="unit">Unit:</label>
            <input
              type="text"
              name="unit"
              value={unit}
              onChange={handleOnChange}
              placeholder="Enter unit (e.g., kg, lb)"
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              backgroundColor: "#8A2BE2",
              color: "white",
            }}
            type="submit"
          >
            {isEditMode ? "Update Product" : "Add Product"}
          </button>
          <button
            style={{ backgroundColor: "red" }}
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
