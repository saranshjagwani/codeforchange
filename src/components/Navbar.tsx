import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Coins } from "lucide-react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [coins, setCoins] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const email = user?.user?.email;

  // Fetch cart items from Firestore
  useEffect(() => {
    const cartRef = collection(fireDB, "cart");
    const unsubscribe = onSnapshot(cartRef, (querySnapshot) => {
      const cartArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(cartArray);
    });
    return () => unsubscribe();
  }, []);

  // Fetch coin balance from Firestore
   
  
  
  useEffect(() => {
    const fetchCoins = () => {
      const userData = JSON.parse(
        localStorage.getItem(email) || '{"coins":0, "images":[]}'
      );
      setCoins(userData.coins);
    };

    fetchCoins(); // Initial fetch

    // Polling local storage for changes (since storage events don't work in the same tab)
    const interval = setInterval(fetchCoins, 100); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [email]);



  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 dark:bg-gray-900">
      <header className="bg-green-600 text-white text-center py-2 text-sm font-medium">
        Get free delivery on orders over ₹300
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-green-600 dark:text-green-400">ECOBI<span className="text-2xl text-blue-400 dark:text-blue-800">N</span></Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link text-black">Home</Link>
            <a href="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/16/15/20241216153741-9IAFZ8D1.json" target="_blank" rel="noopener noreferrer" className="nav-link text-black">AskAI</a>
            <Link to="/product" className="nav-link text-black">Products</Link>
            <Link to="/objdetect" className="nav-link text-black">Object Detection</Link>
            {email === "sj1@gmail.com" && <Link to="/dashboard" className="nav-link text-black">Admin</Link>}
            {user && <a onClick={logout} className="nav-link text-black cursor-pointer">Logout</a>}
            <div className="flex items-center space-x-2">
              <Coins className="text-yellow-600 w-6 h-6" />
              <span className="text-lg font-semibold text-yellow-600">{coins}</span>
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-black" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">{cartItems.length}</span>
                )}
              </Link>
            </div>
          </div>

          <button className="md:hidden text-green-600 dark:text-green-400" onClick={toggleMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-4 mt-4 bg-gray-50 dark:bg-gray-800 rounded-md p-4 shadow-lg">
            <Link to="/" className="nav-link text-black">Home</Link>
            <a href="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/16/15/20241216153741-9IAFZ8D1.json" target="_blank" rel="noopener noreferrer" className="nav-link text-black">AskAI</a>
            <Link to="/product" className="nav-link text-black">Products</Link>
            <Link to="/objdetect" className="nav-link text-black">Object Detection</Link>
            {email === "sj1@gmail.com" && <Link to="/dashboard" className="nav-link text-black">Admin</Link>}
            {user && <a onClick={logout} className="nav-link text-black cursor-pointer">Logout</a>}
            <Link to="/cart" className="flex items-center space-x-2 text-black">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-sm font-medium">{cartItems.length}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
