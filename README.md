# Grocery Shopping App — Project #1 (COMP2013 — Web Programming 2)

**Student:** Ahmad Spierij  
**Assignment:** Project #1  
**Course:** COMP2013 — Web Programming 2

---

## Project overview

This is a simple grocery shopping app built for the COMP2013 Project 1 assignment. The app lets users browse an inventory of grocery products, add items to a cart, change quantities, and check out. I started from the provided starter repo and implemented the required features plus a few extra improvements.

---

## What I added / implemented

Below are the main features I added or implemented beyond the base starter:

1. **Inventory-aware quantity (stock)**

   - Every product has a `quantity` property representing stock available in the inventory.
   - When a user adds items to the cart, the chosen amount is subtracted from the product's available stock.

2. **Unified quantity change handler**

   - I built a single `quantityChangeHandler` that works for both collections (products list and cart).
   - The handler has different logic depending on whether it was called from a product card or a cart card.
   - This handler is passed down to the `QuantityCounter` component and handles both add/remove actions for cart items and for product list items.

3. **Challenge 1 — Cart toggle**

   - Clicking the cart icon in the navbar toggles the cart container visibility (cart can be hidden or shown).

4. **Challenge 2 & 3 — Remove item when quantity reaches zero**

   - If a user decreases an item in the cart down to zero, they get a prompt asking to confirm removal.
     - If confirmed: the item is removed from the cart.
     - If cancelled: the quantity is reset to `1`.
   - This ...

5. **Checkout handler**

   - The checkout button empties the cart and shows an alert thanking the user for the purchase.

6. **Other**
   - Small tweaks and functionlities (e.g., the cart icon shows a red badge with the number of items).
   - All functions are documented with comments in the project files — I explained the logic and why I chose certain approaches.

---

## Components (mapping to assignment)

- `GroceriesAppContainer` — main logic, state, and handlers (imports `products.js`).
- `NavBar` — app .....

---
