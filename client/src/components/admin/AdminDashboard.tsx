import { Calendar, DollarSign, LogOut, Package, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { getUser, logout } from '../../utils/auth';

type TimeFilter = 'today' | 'thisMonth' | 'lastMonth' | 'thisYear';

export const AdminDashboard = () => {
  const { users, products } = useAppContext();
  const user = getUser();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('thisMonth');

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const customers = users.filter((u) => u.role === 'customer');
  const sellers = users.filter((u) => u.role === 'seller');

  const timeFilterOptions: { value: TimeFilter; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisYear', label: 'This Year' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
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
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Analytics Dashboard</h2>
          <div className="flex gap-2 flex-wrap">
            {timeFilterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${timeFilter === option.value
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
                  }`}
              >
                <Calendar size={16} className="inline mr-2" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <DollarSign size={24} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900">$ 0.00</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Sales</p>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-slate-900">{customers.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Package size={24} className="text-orange-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Products</p>
            <p className="text-3xl font-bold text-slate-900">{products.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Sellers ({sellers.length})</h3>
            <div className="space-y-3">
              {sellers.map((seller) => {
                const sellerProducts = products.filter((p) => p.seller_id === seller.id);
                return (
                  <div key={seller.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">{seller.name}</p>
                      <p className="text-sm text-slate-500">{seller.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">{sellerProducts.length} products</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Customers ({customers.length})</h3>
            <div className="space-y-3">
              {customers.map((customer) => {
                return (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">{customer.name}</p>
                      <p className="text-sm text-slate-500">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">
                        $ 0
                      </p>
                      <p className="text-xs text-slate-500">
                        0 orders
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};