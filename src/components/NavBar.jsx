import { ShoppingCart } from "lucide-react";

export default function NavBar({ cartCount, handleToggleCartAppearance }) {
  return (
    <nav className="NavBar">
      <div className="NavUser">Hello, Ahmad Spierij</div>
      <div className="NavTitle">Groceries App 🍎</div>
      <div className="nav-cart" onClick={handleToggleCartAppearance}>
        <ShoppingCart />
        <span className="nav-cart-count-badge">{cartCount}</span>
      </div>
    </nav>
  );
}
