import "./App.css";
import products from "./data/products.js";
import GroceriesAppContainer from "./components/GroceriesAppContainer.jsx";
import NavBar from "./components/NavBar.jsx";

function App() {
  return <GroceriesAppContainer products={products} />;
}

export default App;
