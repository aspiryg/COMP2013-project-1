import { useState } from "react";
import ProductsContainer from "./ProductsContainer";
import CartContainer from "./CartContainer";
import NavBar from "./NavBar";

export default function GroceriesAppContainer({ products }) {
  // States
  // state #1: Product List State
  const [productList, setProductList] = useState(
    products.map((product) => ({
      ...product,
      // Represent sales quantity (the quantity user wants to buy)
      salesQuantity: 0,
      // Represent inventory quantity (the quantity available in stock)
      inventoryQuantity: parseQuantity(product.quantity),
      // Represent price (as a number)
      priceNumber: parsePrice(product.price),
    }))
  );
  // state #2: Cart State
  const [cart, setCart] = useState([]);
  // console.log("Cart:", cart);

  // state #3: toggle cart appearance (for Challenge 1)
  const [isCartVisible, setIsCartVisible] = useState(false);

  // utility functions
  // util #1: convert product quantity to a number (to use is it in available stock calculations)
  function parseQuantity(qtyStr) {
    const qtyNumber = parseInt(qtyStr);
    return isNaN(qtyNumber) ? 0 : qtyNumber;
  }

  // util #2: convert price string to a number
  function parsePrice(priceStr) {
    const priceNumber = parseFloat(priceStr.replace("$", "").replace(",", ""));
    return isNaN(priceNumber) ? 0 : priceNumber;
  }

  // util #3: update quantity (shared logic for products and cart quantity updates)
  function updateQuantity(quantity, change, min = 0, max) {
    const newQuantity = quantity + change;
    if (newQuantity < min) return min;
    if (newQuantity > max) {
      alert("Cannot exceed available stock quantity.");
      return max;
    }
    return newQuantity;
  }

  // Event Handlers
  // handler #1: Handle adding quantity (Add/Remove)
  const handleQuantityChange = (productId, value, collection) => {
    // collection: "products" or "cart"
    // products logic
    if (collection === "products") {
      const updatedProducts = productList.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            salesQuantity: updateQuantity(
              product.salesQuantity,
              value,
              0,
              product.inventoryQuantity
            ),
            // I extracted this logic into its own function above to avoid repetition
            // // prevent negative quantity
            // value < 0 && product.salesQuantity <= 0
            //   ? 0
            //   : // prevent having salesQuantity more than product inventory quantity
            //   value > 0 && product.salesQuantity >= product.inventoryQuantity
            //   ? (alert("Cannot exceed available stock quantity."),
            //     product.salesQuantity)
            //   : product.salesQuantity + value,
          };
        }
        return product;
      });
      setProductList(updatedProducts);
      //
      // cart logic
    } else if (collection === "cart") {
      // #1: Update cart item quantity
      const updatedCart = cart.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            // another way to prevent negative quantity & exceeding max quantity (available stock)
            // quantity: Math.min(
            //   Math.max(0, item.quantity + value),
            //   item.maxQuantity
            // ),

            quantity: updateQuantity(item.quantity, value, 0, item.maxQuantity),
          };
        }
        return item;
      });
      setCart(updatedCart);

      // #3: Challenges: (2 & 3) remove if quantity is zero & confirm removal
      const quantityZeroItem = updatedCart.find(
        (item) => item.id === productId
      );

      if (quantityZeroItem && quantityZeroItem.quantity === 0) {
        const confirmRemoval = handleRemoveFromCart(productId);
        if (!confirmRemoval) {
          // user cancelled removal, reset quantity back to 1
          setCart((prevCart) =>
            prevCart.map((item) =>
              item.id === productId ? { ...item, quantity: 1 } : item
            )
          );
        }
        return; //
      }

      // #2: Update product inventory quantity accordingly
      setProductList((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                inventoryQuantity:
                  product.inventoryQuantity &&
                  product.inventoryQuantity - value,
              }
            : product
        )
      );
    }
  };

  // handler #2: Add to cart
  const handleAddToCart = (productId) => {
    const productToAdd = productList.find(
      (product) => product.id === productId
    );
    if (!productToAdd) return;
    // #1:
    if (productToAdd.salesQuantity < 1) {
      alert("Quantity must be at least 1 to add to cart.");
      return;
    }
    setCart((prevCart) => {
      const existingCartItem = prevCart.find((item) => item.id === productId);
      //#2: check if item already exists in cart
      if (existingCartItem) {
        // #3: adding to existing item in cart
        return prevCart.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity + productToAdd.salesQuantity,
              }
            : item
        );
      }
      // #4: adding new item to cart
      return [
        ...prevCart,
        // create a new cart item
        {
          id: productToAdd.id,
          productName: productToAdd.productName,
          brand: productToAdd.brand,
          quantity: productToAdd.salesQuantity,
          image: productToAdd.image,
          price: productToAdd.priceNumber,
          // represent max quantity allowed in cart (based on available stock)
          maxQuantity: productToAdd.inventoryQuantity,
        },
      ];
    });

    // #5: reset sales quantity after adding the item to cart
    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, salesQuantity: 0 } : product
      )
    );

    // #6: reduce inventory quantity
    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              inventoryQuantity:
                product.inventoryQuantity - productToAdd.salesQuantity,
            }
          : product
      )
    );
  };

  // handler #3: Remove from cart
  const handleRemoveFromCart = (productId, isBulkRemove = false) => {
    const cartItemToRemove = cart.find((item) => item.id === productId);
    if (!cartItemToRemove) return true;
    // #1: Confirm delete (if not bulk remove)
    if (!isBulkRemove) {
      const confirmRemoval = window.confirm("Confirm delete!");
      if (!confirmRemoval) {
        /* 
    this return value is used in the handleQuantityChange function to determine
    whether to reset the quantity back to 1 if the user cancels the removal
    */
        return false;
      }
    }
    // #2: delete
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    //
    // #3: Restore inventory quantity back to products list
    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product.id === cartItemToRemove.id
          ? {
              ...product,
              inventoryQuantity:
                product.inventoryQuantity + cartItemToRemove.quantity,
            }
          : product
      )
    );
    return true;
  };

  // handler #5: Empty cart
  const handleEmptyCart = () => {
    const confirmEmpty = window.confirm("Confirm empty cart?");
    if (!confirmEmpty) return;
    // I wanted to use handleRemoveFromCart in a loop here, but for some reason it didn't work as expected
    // My guess is that the issue is related to multiple state updates in the loop causing async problems
    //

    // #1: Restore inventory quantities in one go (to avoid multiple state updates and async issues)
    const updatedProducts = [...productList];
    productList.forEach((product) => {
      const cartItem = cart.find((item) => item.id === product.id);
      if (cartItem) {
        updatedProducts[productList.indexOf(product)] = {
          ...product,
          inventoryQuantity: product.inventoryQuantity + cartItem.quantity,
        };
      }
    });

    // #2: Update product list
    setProductList(updatedProducts);
    // #3: Clear cart
    setCart([]);
  };

  // handler #6: checkout for Challenge #4
  const handleCheckout = () => {
    setCart([]);
    alert("Thank you for your purchase!");
  };

  // handler #4: Toggle cart appearance (for Challenge #1)
  const handleToggleCartAppearance = () => {
    // #1: toggle state
    setIsCartVisible((prev) => !prev);

    // #2: scroll to cart container
    const cartContainer = document.getElementById("cart");
    if (cartContainer) {
      if (isCartVisible) {
        cartContainer.style.display = "block";
        cartContainer.scrollIntoView({ behavior: "smooth" });
      } else {
        cartContainer.style.display = "none";
      }
    }
  };

  return (
    // I had NavBar in the app component first, then moved it here to have access to cart state for cart count
    <>
      <NavBar
        cartCount={cart.length}
        handleToggleCartAppearance={handleToggleCartAppearance}
      />
      <div className="GroceriesApp-Container">
        <ProductsContainer
          products={productList}
          handleQuantityChange={handleQuantityChange}
          handleAddToCart={handleAddToCart}
          isCartVisible={isCartVisible}
        />
        {/* 
        I moved the conditional rendering for the cart into its own component, I guess this makes it cleaner and more reusable
         */}

        <CartContainer
          cart={cart}
          handleQuantityChange={handleQuantityChange}
          handleRemoveFromCart={handleRemoveFromCart}
          handleEmptyCart={handleEmptyCart}
          handleCheckout={handleCheckout}
        />
      </div>
    </>
  );
}
