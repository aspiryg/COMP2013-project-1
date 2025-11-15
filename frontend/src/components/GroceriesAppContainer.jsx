import { useState, useEffect } from "react";
import axios from "axios";
import ProductsContainer from "./ProductsContainer";
import CartContainer from "./CartContainer";
import ProductsForm from "./ProductsForm";
import NavBar from "./NavBar";

const BaseUrl = "http://localhost:3000/products"; // Backend server URL

export default function GroceriesAppContainer() {
  // States
  // state #1: Product List State
  const [productList, setProductList] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    price: "",
    image: "",
    quantity: "",
    unit: "", // this field is not stored in the backend, it's just for the form (while submission it will be concatenated with quantity)
    _id: "", //
  });

  // state #2: Cart State
  const [cart, setCart] = useState([]);
  // state #3: toggle cart appearance (for Challenge 1)
  const [isCartVisible, setIsCartVisible] = useState(false);
  // state #4: toggle products form appearance
  const [isProductsFormVisible, setIsProductsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // utility functions
  // util #1: convert product quantity to a number (to use is it in available stock calculations)
  function parseQuantity(qtyStr = "") {
    // console.log("Parsing quantity:", qtyStr);
    const qtyNumber = parseInt(qtyStr);
    return isNaN(qtyNumber) ? 0 : qtyNumber;
  }

  // util #2: convert price string to a number
  function parsePrice(priceStr = "") {
    // console.log("Parsing price:", priceStr);
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

  // Handler functions
  const fetchProducts = async () => {
    try {
      const response = await axios.get(BaseUrl);
      const products = response.data;

      // re-building the product object to be be compatible with my previous project implementation
      const updatedProducts = products.map((product) => {
        const quantity = product.quantity || "10 g"; // default quantity if not provided
        const inventoryQuantity = parseQuantity(quantity);
        const priceNumber = parsePrice(product.price);
        return {
          ...product,
          quantity, // original quantity string
          inventoryQuantity, // available stock quantity (number)
          priceNumber, // price as number
          salesQuantity: 0, // initial sales quantity (this represents the quantity user wants to buy)
        };
      });
      setProductList(updatedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // handle form input changes
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle on submit
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      handleUpdateProduct();
    } else {
      handleAddNewProduct();
    }
    resetForm();
  };

  // handle add new product.
  const handleAddNewProduct = async () => {
    // #1: validate inputs
    if (
      !formData.productName ||
      !formData.brand ||
      !formData.price ||
      !formData.quantity
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    // #2: concatenate quantity and unit
    const fullQuantity = `${formData.quantity} ${formData.unit}`;
    // #3: prepare price string
    const priceString = `$${parseFloat(formData.price).toFixed(2)}`;

    // #4: prepare product data for submission
    const productData = {
      ...formData,
      quantity: fullQuantity,
      price: priceString,
    };
    // #5: submit
    try {
      const response = await axios.post(BaseUrl, productData);
      if (response.status === 201) {
        alert("Product added successfully!");
        setIsProductsFormVisible(false);
        fetchProducts(); // refresh product list
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  // handle click edit button
  const handleOnEdit = (product) => {
    setIsEditMode(true);
    setIsProductsFormVisible(true);
    // I could have fetched the product details from the backend using /products/:id endpoint
    // but since I already have the product data in the frontend, I will use it to populate the form
    setFormData({
      productName: product.productName,
      brand: product.brand,
      price: parsePrice(product.price).toString(),
      image: product.image,
      quantity: product.inventoryQuantity,
      unit:
        productList.find((p) => p._id === product.id)?.quantity.split(" ")[1] ||
        "", // just to get the unit from existing product quantity and add it to the form
      _id: product.id,
    });
  };

  // handle edit product
  const handleUpdateProduct = async () => {
    // #1: validate inputs
    if (
      !formData.productName ||
      !formData.brand ||
      !formData.price ||
      !formData.quantity
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    // #2: concatenate quantity and unit
    const fullQuantity = `${formData.quantity} ${formData.unit}`;
    // #3: prepare price string
    const priceString = `$${parseFloat(formData.price).toFixed(2)}`;
    // #4: prepare product data for submission
    const productData = {
      ...formData,
      quantity: fullQuantity,
      price: priceString,
    };
    // #5: submit
    // console.log(`Updating product ${formData._id} with data:`, productData);
    try {
      const response = await axios.patch(
        `${BaseUrl}/${formData._id}`,
        productData
      );
      if (response.status === 200) {
        alert(`Product ${formData.productName} updated successfully!`);
        setIsProductsFormVisible(false);
        fetchProducts(); // refresh product list
      } else {
        alert(
          `Failed to update product ${formData.productName}. Please try again.`
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        `An error occurred while updating the product ${formData.productName}.`
      );
    }
  };

  // handle delete product
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Confirm delete product?");
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(`${BaseUrl}/${productId}`);
      if (response.status === 200) {
        alert("Product deleted successfully!");
        fetchProducts(); // refresh product list
      } else {
        alert("Failed to delete product. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  // handle reset form
  const resetForm = () => {
    setFormData({
      productName: "",
      brand: "",
      price: "",
      image: "",
      quantity: "",
      unit: "",
      _id: "",
    });
    setIsEditMode(false);
  };

  /* 
    //
    //
    //
      Event Handlers (Old) project 01
    */
  // handler #1: Handle adding quantity (Add/Remove)
  const handleQuantityChange = (productId, value, collection) => {
    // collection: "products" or "cart"
    // products logic
    if (collection === "products") {
      const updatedProducts = productList.map((product) => {
        if (product._id === productId) {
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
          product._id === productId
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
      (product) => product._id === productId
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
          id: productToAdd._id,
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
        product._id === productId ? { ...product, salesQuantity: 0 } : product
      )
    );

    // #6: reduce inventory quantity
    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
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
        product._id === cartItemToRemove.id
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
      const cartItem = cart.find((item) => item.id === product._id);
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
      <button
        onClick={() => setIsProductsFormVisible((prev) => !prev)}
        style={{ marginTop: "10px" }}
      >
        {isProductsFormVisible
          ? isEditMode
            ? "Close Edit Product Form"
            : "Close Add Product Form"
          : "Add New Product"}
      </button>
      <div className="GroceriesApp-Container">
        {isProductsFormVisible && (
          <ProductsForm
            {...formData}
            isEditMode={isEditMode}
            handleCancel={() => {
              setIsProductsFormVisible(false);
              resetForm();
            }}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
          />
        )}
        <ProductsContainer
          products={productList}
          handleQuantityChange={handleQuantityChange}
          handleAddToCart={handleAddToCart}
          isCartVisible={isCartVisible}
          handleOnEdit={handleOnEdit}
          handleDeleteProduct={handleDeleteProduct}
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
