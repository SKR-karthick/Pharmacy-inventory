const stats = [
  { name: 'Total Medicines', value: '2,847', change: '+12%', trend: 'up', color: 'emerald' },
  { name: 'Low Stock', value: '23', change: '-5%', trend: 'down', color: 'amber' },
  { name: 'Expiring Soon', value: '18', change: '+2', trend: 'up', color: 'rose' },
  { name: 'Today Sales', value: '₹45,230', change: '+8%', trend: 'up', color: 'sky' },
]

const recentSales = [
  { id: 'INV-001', customer: 'Walk-in Customer', items: 3, total: '₹1,250', time: '2 min ago' },
  { id: 'INV-002', customer: 'Rajesh Kumar', items: 5, total: '₹3,420', time: '15 min ago' },
  { id: 'INV-003', customer: 'Priya Sharma', items: 2, total: '₹890', time: '32 min ago' },
  { id: 'INV-004', customer: 'Walk-in Customer', items: 1, total: '₹150', time: '1 hr ago' },
]

const lowStockItems = [
  { name: 'Paracetamol 500mg', stock: 12, minStock: 50 },
  { name: 'Amoxicillin 250mg', stock: 8, minStock: 30 },
  { name: 'Omeprazole 20mg', stock: 15, minStock: 40 },
]

const colorClasses = {
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  sky: 'bg-sky-50 text-sky-600',
}

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Overview of your pharmacy operations</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-5 border border-slate-200/60">
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${colorClasses[stat.color]}`}>
                {stat.name}
              </span>
              <span className={`text-xs font-medium ${stat.trend === 'up' && stat.color !== 'rose' && stat.color !== 'amber' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-emerald-600' : 'text-slate-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Sales */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/60">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Sales</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentSales.map((sale) => (
              <div key={sale.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{sale.id}</p>
                    <p className="text-xs text-slate-400">{sale.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{sale.total}</p>
                  <p className="text-xs text-slate-400">{sale.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">View all sales →</button>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Low Stock</h2>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-xs font-medium rounded-md">
              {lowStockItems.length} items
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {lowStockItems.map((item) => (
              <div key={item.name} className="px-5 py-3.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-700">{item.name}</p>
                  <span className="text-xs font-semibold text-rose-600">{item.stock} left</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1">
                  <div 
                    className="bg-rose-400 h-1 rounded-full transition-all" 
                    style={{ width: `${Math.min((item.stock / item.minStock) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">View all →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
