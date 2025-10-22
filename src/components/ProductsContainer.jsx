import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleQuantityChange,
  handleAddToCart,
  isCartVisible,
}) {
  return (
    <div
      className={
        isCartVisible
          ? "product-container-full"
          : "product-container-seventy-five"
      }
    >
      {products.map((product) => {
        return (
          <ProductCard
            key={product.id}
            {...product}
            handleQuantityChange={handleQuantityChange}
            handleAddToCart={handleAddToCart}
          />
        );
      })}
    </div>
  );
}
