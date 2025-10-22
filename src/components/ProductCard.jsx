import QuantityCounter from "./QuantityCounter";

export default function ProductCard({
  productName,
  brand,
  image,
  salesQuantity,
  price,
  handleQuantityChange,
  id,
  handleAddToCart,
  inventoryQuantity,
  // priceNumber,
}) {
  return (
    <div className="product-card">
      <h3>{productName}</h3>
      <img src={image} alt={productName} />
      <p>{brand}</p>
      <QuantityCounter
        quantity={salesQuantity}
        handleQuantityChange={handleQuantityChange}
        id={id}
        collection="products"
      />
      <p>{price}</p>
      {/* <p>Total: ${(salesQuantity * priceNumber).toFixed(2)}</p> */}
      <button onClick={() => handleAddToCart(id)}>Add to Cart</button>
      <p style={{ color: inventoryQuantity < 1 ? "red" : "yellow" }}>
        Available Stock : {inventoryQuantity}
      </p>
    </div>
  );
}
