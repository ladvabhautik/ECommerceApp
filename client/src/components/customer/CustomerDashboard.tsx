import { CheckCircle, LogOut, Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { CartItem } from '../../types';
import { getUser, logout } from '../../utils/auth';

export const CustomerDashboard = () => {
  const user = getUser();
  const { products } = useAppContext();
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const addToCart = (productId: string) => {
    if (!user) return;

    const existingItem = cart.find(item => item.productId === productId);
    const product = products.find(p => p.id === productId);

    if (!product || product.stock === 0) return;

    let newCart: CartItem[];
    if (existingItem) {
      const currentQuantity = existingItem.quantity;
      if (currentQuantity >= product.stock) return;

      newCart = cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { productId, quantity: 1 }];
    }

    setCartState(newCart);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    if (!user) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newCart = cart
      .map(item => {
        if (item.productId === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity > product.stock) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter(item => item.quantity > 0);

    setCartState(newCart);
  };

  const removeFromCart = (productId: string) => {
    if (!user) return;

    const newCart = cart.filter(item => item.productId !== productId);
    setCartState(newCart);
  };

  const checkout = () => {
    if (!user || cart.length === 0) return;

    const transactionItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error('Product not found');

      // updateProduct(product.id, { stock: product.stock - item.quantity });

      return {
        productId: product.id,
        productName: product.title,
        quantity: item.quantity,
        price: product.price,
      };
    });

    setCartState([]);
    setShowCart(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Shop</h1>
              <p className="text-slate-600 text-sm">Welcome, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCart(true)}
                className="relative flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
              >
                <ShoppingCart size={20} />
                Cart
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Discover Amazing Products</h2>
          <p className="text-emerald-50">Browse our collection and find what you love</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category: any) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${selectedCategory === category
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const cartItem = cart.find(item => item.productId === product.id);
            const quantityInCart = cartItem?.quantity || 0;

            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{product.title}</h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                      ${product.price}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="text-slate-500">By {product.seller_name}</span>
                    <span className={`font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0 || quantityInCart >= product.stock}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold"
                  >
                    <ShoppingBag size={18} />
                    {quantityInCart >= product.stock ? 'Max Quantity' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <Trash2 size={24} />
              </button>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={64} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;

                      return (
                        <div key={item.productId} className="flex gap-4 bg-slate-50 rounded-lg p-4">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900">{product.title}</h3>
                            <p className="text-emerald-600 font-semibold">${product.price}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => updateCartQuantity(item.productId, -1)}
                                className="p-1 bg-white rounded hover:bg-slate-200 transition"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.productId, 1)}
                                disabled={item.quantity >= product.stock}
                                className="p-1 bg-white rounded hover:bg-slate-200 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
                              >
                                <Plus size={16} />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">
                              ${(product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-slate-700">Total:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={checkout}
                      className="w-full bg-emerald-500 text-white py-4 rounded-lg hover:bg-emerald-600 transition font-bold text-lg"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle size={24} />
          <span className="font-semibold">Purchase successful!</span>
        </div>
      )}
    </div>
  );
};
