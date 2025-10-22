export default function QuantityCounter({
  quantity,
  handleQuantityChange,
  id,
  collection,
}) {
  return (
    <div className="ProductQuantityDiv">
      <button onClick={() => handleQuantityChange(id, -1, collection)}>
        -
      </button>
      <span>{quantity}</span>
      <button onClick={() => handleQuantityChange(id, 1, collection)}>+</button>
    </div>
  );
}
