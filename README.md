# Grocery Shopping App — Project #2 (COMP2013 — Web Programming 2)

**Student:** Ahmad Spierij  
**Assignment:** Project #2  
**Course:** COMP2013 — Web Programming 2

---

## Project overview

This the second iteration of the Grocery Shopping App, which is a simple grocery shopping app built for the COMP2013 Project 2 assignment. This iteration connects to a backend API to perform CRUD operations on the products. The backend API is built using Node.js and Express, the database used is MongoDB, and the frontend is built using React.

### I built this project upon the code from the previous assignment (Project #1) as a starter, and tried to keep the same functionality and UI/UX as much as possible while changing the code to connect to the backend API.

## Improvements and additions:

Below are the main features I added or implemented beyond the basic project requirements:

1. **Backward compatibility with the previous project**

   - I add `quantity` property to products to maintain compatibility with the previous project.
   - The `ProductForm` has a `unit` field that does not actually exist in the product model, I separated the `quantity` and `unit` fields in the form but combined them into a single `string` `quantity` property inside the `handleAddProduct` and `handleUpdateProduct` functions.

2. **Modal feature for the product form**

   - I created a modal component that displays the product form when the "Add New Product" button is clicked.
   - The modal does not close when clicking outside of it; it only closes when the user clicks the cancel button submits the form.
   - `isProductsFormVisible` state variable is used to track the visibility of the modal.
   - The CSS for the modal is in `App.css`.

3. **Alert Notify feature**

   - I implemented an alert notification system that displays success or error messages with each mutation (adding, updating, deleting products).

4. **Form validation**

   - I added client-side validation to the `handleUpdateProduct` and `handleAddProduct` functions to ensure that:
     - The product name is not empty.
     - The price is a positive number.
     - The quantity is a positive number.
   - If validation fails, an error alert is shown and the form submission is prevented.

5. **Delete product confirmation**

   - I added a confirmation alert when the user clicks the delete button.
