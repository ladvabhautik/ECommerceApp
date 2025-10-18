import { Edit, LogOut, Package, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Product } from '../../types';
import api from '../../utils/api';
import { getUser, logout } from '../../utils/auth';
import { notifyError, notifySuccess } from '../../utils/helper';
import { ProductForm } from './ProductForm';

export const SellerDashboard = () => {
  const user = getUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const loadProducts = async () => {
    if (user) {
      const { data } = await api.get('/products');
      console.log(data)
      const sellerProducts = data.filter(p => p.seller_id === user.id);
      setProducts(sellerProducts);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`, {
          data: { seller_id: user.id }
        });
        loadProducts();  // Reload products after deletion
        notifySuccess('Product deleted successfully.');
      } catch (error) {
        console.error("Error deleting product:", error);
        notifyError("Failed to delete product. Please try again.");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = async () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
              <p className="text-slate-600 text-sm">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Package size={32} />
            <h2 className="text-3xl font-bold">My Products</h2>
          </div>
          <p className="text-emerald-50 mb-6">Manage your product inventory</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Package size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No products yet</h3>
            <p className="text-slate-500 mb-6">Start by adding your first product</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{product.title}</h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      ${product.price}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-500">Stock: {product.stock}</span>
                    <span className="text-sm text-slate-500">{product.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};