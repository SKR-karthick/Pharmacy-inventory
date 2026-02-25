import { useState } from 'react'

const salesData = [
  { id: 'INV-001', date: '2026-02-25', customer: 'Walk-in Customer', doctor: 'Dr. Senthil', items: 3, total: 1250 },
  { id: 'INV-002', date: '2026-02-25', customer: 'Rajesh Kumar', doctor: 'Dr. Priya', items: 5, total: 3420 },
  { id: 'INV-003', date: '2026-02-25', customer: 'Priya Sharma', doctor: 'Dr. Senthil', items: 2, total: 890 },
  { id: 'INV-004', date: '2026-02-24', customer: 'Walk-in Customer', doctor: 'Dr. Kavitha', items: 1, total: 150 },
  { id: 'INV-005', date: '2026-02-24', customer: 'Anand Raj', doctor: 'Dr. Priya', items: 4, total: 2780 },
  { id: 'INV-006', date: '2026-02-23', customer: 'Lakshmi Devi', doctor: 'Dr. Senthil', items: 6, total: 4560 },
  { id: 'INV-007', date: '2026-02-23', customer: 'Suresh Babu', doctor: 'Dr. Kavitha', items: 2, total: 680 },
  { id: 'INV-008', date: '2026-02-22', customer: 'Meena Kumari', doctor: 'Dr. Priya', items: 3, total: 1920 },
  { id: 'INV-009', date: '2026-02-21', customer: 'Walk-in Customer', doctor: 'Dr. Senthil', items: 1, total: 340 },
  { id: 'INV-010', date: '2026-02-20', customer: 'Ganesh Moorthy', doctor: 'Dr. Kavitha', items: 7, total: 5120 },
]

const topSellingMedicines = [
  { name: 'Paracetamol 500mg', sold: 342, revenue: 4104 },
  { name: 'Amoxicillin 250mg', sold: 215, revenue: 9675 },
  { name: 'Cetirizine 10mg', sold: 189, revenue: 1512 },
  { name: 'Omeprazole 20mg', sold: 156, revenue: 4368 },
  { name: 'Azithromycin 500mg', sold: 98, revenue: 8330 },
]

const expiringMedicines = [
  { name: 'Metformin 500mg', batch: 'BTH-2026-005', expiry: '2026-03-30', stock: 12, daysLeft: 33 },
  { name: 'Amoxicillin 250mg', batch: 'BTH-2026-002', expiry: '2026-04-20', stock: 8, daysLeft: 54 },
  { name: 'Ibuprofen 400mg', batch: 'BTH-2026-007', expiry: '2026-05-05', stock: 5, daysLeft: 69 },
  { name: 'Azithromycin 500mg', batch: 'BTH-2026-006', expiry: '2026-05-18', stock: 75, daysLeft: 82 },
]

const categoryStock = [
  { category: 'Pain Relief', items: 12, value: 28400 },
  { category: 'Antibiotics', items: 8, value: 45200 },
  { category: 'Gastro', items: 6, value: 18900 },
  { category: 'Allergy', items: 5, value: 8400 },
  { category: 'Diabetes', items: 7, value: 32100 },
  { category: 'Cardiac', items: 4, value: 22800 },
  { category: 'Vitamins', items: 9, value: 15600 },
]

const dateRanges = ['Today', 'This Week', 'This Month', 'This Quarter']

export default function Reports() {
  const [activeRange, setActiveRange] = useState('This Month')
  const [activeTab, setActiveTab] = useState('sales')

  const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
  const totalPurchases = 14850
  const profit = totalSales - totalPurchases
  const totalItemsSold = salesData.reduce((sum, s) => sum + s.items, 0)
  const totalStockValue = categoryStock.reduce((sum, c) => sum + c.value, 0)

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Reports</h1>
          <p className="text-slate-500 text-sm mt-0.5">Analytics and insights for your pharmacy</p>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
          {dateRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeRange === range
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-600">Total Sales</span>
            <span className="text-xs font-medium text-emerald-600">+18%</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">₹{totalSales.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{salesData.length} invoices</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-sky-50 text-sky-600">Purchases</span>
            <span className="text-xs font-medium text-slate-400">-3%</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">₹{totalPurchases.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">5 suppliers</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-600">Net Profit</span>
            <span className="text-xs font-medium text-emerald-600">+24%</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">₹{profit.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{((profit / totalSales) * 100).toFixed(1)}% margin</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-600">Items Sold</span>
            <span className="text-xs font-medium text-emerald-600">+12%</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">{totalItemsSold}</p>
          <p className="text-xs text-slate-400 mt-1">across {salesData.length} orders</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-slate-200">
        {[
          { key: 'sales', label: 'Sales Report' },
          { key: 'top', label: 'Top Sellers' },
          { key: 'expiry', label: 'Expiry Alerts' },
          { key: 'inventory', label: 'Inventory Value' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${activeTab === tab.key
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sales Report */}
      {activeTab === 'sales' && (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesData.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium text-emerald-600">{sale.id}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{sale.date}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-700">{sale.customer}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{sale.doctor}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-slate-600">{sale.items}</td>
                    <td className="px-4 py-3.5 text-sm text-right font-semibold text-slate-800">₹{sale.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-sm font-semibold text-slate-700">Total</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-slate-700">{totalItemsSold}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-emerald-600">₹{totalSales.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Top Sellers */}
      {activeTab === 'top' && (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Medicine</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Units Sold</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-48">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topSellingMedicines.map((med, index) => {
                  const maxSold = topSellingMedicines[0].sold
                  const barWidth = (med.sold / maxSold) * 100
                  const colors = ['bg-emerald-400', 'bg-sky-400', 'bg-violet-400', 'bg-amber-400', 'bg-rose-400']
                  return (
                    <tr key={med.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-600' : 'bg-slate-300'
                          }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-800">{med.name}</td>
                      <td className="px-4 py-3.5 text-sm text-center font-semibold text-slate-700">{med.sold}</td>
                      <td className="px-4 py-3.5 text-sm text-right font-semibold text-slate-800">₹{med.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={`${colors[index]} h-2 rounded-full transition-all`} style={{ width: `${barWidth}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expiry Alerts */}
      {activeTab === 'expiry' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiringMedicines.map((med) => (
              <div key={med.batch} className={`bg-white rounded-xl border p-5 ${med.daysLeft <= 30 ? 'border-rose-200 bg-rose-50/30' :
                  med.daysLeft <= 60 ? 'border-amber-200 bg-amber-50/30' :
                    'border-slate-200/60'
                }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{med.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{med.batch}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${med.daysLeft <= 30 ? 'bg-rose-100 text-rose-700' :
                      med.daysLeft <= 60 ? 'bg-amber-100 text-amber-700' :
                        'bg-sky-100 text-sky-700'
                    }`}>
                    {med.daysLeft} days left
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Expires: {med.expiry}</span>
                  <span className="font-medium text-slate-700">{med.stock} units in stock</span>
                </div>
                <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${med.daysLeft <= 30 ? 'bg-rose-400' :
                        med.daysLeft <= 60 ? 'bg-amber-400' :
                          'bg-sky-400'
                      }`}
                    style={{ width: `${Math.max(5, 100 - med.daysLeft)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Value */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Total Inventory Value</h3>
              <span className="text-2xl font-bold text-emerald-600">₹{totalStockValue.toLocaleString()}</span>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden bg-slate-100">
              {categoryStock.map((cat, i) => {
                const colors = ['bg-emerald-400', 'bg-sky-400', 'bg-violet-400', 'bg-amber-400', 'bg-rose-400', 'bg-teal-400', 'bg-indigo-400']
                return (
                  <div
                    key={cat.category}
                    className={`${colors[i]} transition-all`}
                    style={{ width: `${(cat.value / totalStockValue) * 100}%` }}
                    title={`${cat.category}: ₹${cat.value.toLocaleString()}`}
                  ></div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Stock Value</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryStock.map((cat, i) => {
                  const dotColors = ['bg-emerald-400', 'bg-sky-400', 'bg-violet-400', 'bg-amber-400', 'bg-rose-400', 'bg-teal-400', 'bg-indigo-400']
                  return (
                    <tr key={cat.category} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${dotColors[i]}`}></span>
                          <span className="text-sm font-medium text-slate-700">{cat.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-center text-slate-600">{cat.items}</td>
                      <td className="px-4 py-3.5 text-sm text-right font-semibold text-slate-800">₹{cat.value.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-sm text-right text-slate-500">{((cat.value / totalStockValue) * 100).toFixed(1)}%</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-700">Total</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-slate-700">{categoryStock.reduce((s, c) => s + c.items, 0)}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-emerald-600">₹{totalStockValue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-slate-700">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
