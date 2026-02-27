import { useNavigate } from 'react-router-dom'

// --- Mock Data ---
const kpiCards = [
  { label: 'Today Sales', value: '₹45,230', change: '+8.2%', trend: 'up', icon: '💰', color: 'emerald' },
  { label: 'Today Purchases', value: '₹28,500', change: '+4.1%', trend: 'up', icon: '📦', color: 'sky' },
  { label: 'Net Profit Today', value: '₹16,730', change: '+12.5%', trend: 'up', icon: '📈', color: 'violet' },
  { label: 'Total Stock Value', value: '₹4,85,000', change: '+2.3%', trend: 'up', icon: '🏪', color: 'slate' },
  { label: 'Low Stock Items', value: '7', change: '-3', trend: 'down', icon: '⚠️', color: 'amber', clickable: true },
  { label: 'Expiring in 30d', value: '4', change: '+1', trend: 'up', icon: '⏰', color: 'rose', clickable: true },
]

const salesChartData = [
  { day: 'Mon', sales: 32000, purchases: 18000 },
  { day: 'Tue', sales: 45000, purchases: 22000 },
  { day: 'Wed', sales: 28000, purchases: 35000 },
  { day: 'Thu', sales: 52000, purchases: 20000 },
  { day: 'Fri', sales: 41000, purchases: 25000 },
  { day: 'Sat', sales: 58000, purchases: 30000 },
  { day: 'Sun', sales: 35000, purchases: 15000 },
]

const topSellingMedicines = [
  { name: 'Paracetamol 500mg', sold: 245, revenue: 2940 },
  { name: 'Dolo 650mg', sold: 198, revenue: 3564 },
  { name: 'Cetirizine 10mg', sold: 167, revenue: 1336 },
  { name: 'Pantoprazole 40mg', sold: 142, revenue: 4970 },
  { name: 'Amoxicillin 250mg', sold: 120, revenue: 5400 },
]

const recentSales = [
  { id: 'CMC-INV-4821', customer: 'Walk-in Customer', items: 3, total: '₹1,250', time: '2 min ago', doctor: 'Dr. Senthil' },
  { id: 'CMC-INV-4820', customer: 'Rajesh Kumar', items: 5, total: '₹3,420', time: '15 min ago', doctor: 'Dr. Meena' },
  { id: 'CMC-INV-4819', customer: 'Priya Sharma', items: 2, total: '₹890', time: '32 min ago', doctor: 'Dr. Senthil' },
  { id: 'CMC-INV-4818', customer: 'Arun Prasad', items: 4, total: '₹2,150', time: '45 min ago', doctor: 'Dr. Ravi' },
  { id: 'CMC-INV-4817', customer: 'Walk-in Customer', items: 1, total: '₹150', time: '1 hr ago', doctor: '' },
]

const lowStockItems = [
  { name: 'Ibuprofen 400mg', stock: 5, minStock: 50, batch: 'BTH-2026-007' },
  { name: 'Amoxicillin 250mg', stock: 8, minStock: 30, batch: 'BTH-2026-002' },
  { name: 'Metformin 500mg', stock: 12, minStock: 40, batch: 'BTH-2026-005' },
  { name: 'Omeprazole 20mg', stock: 15, minStock: 40, batch: 'BTH-2026-003' },
]

const expiryAlerts = [
  { name: 'Metformin 500mg', batch: 'BTH-2026-005', expiry: '2026-03-15', daysLeft: 16, stock: 12 },
  { name: 'Amoxicillin 250mg', batch: 'BTH-2026-002', expiry: '2026-04-20', daysLeft: 52, stock: 8 },
  { name: 'Azithromycin 500mg', batch: 'BTH-2026-006', expiry: '2026-05-18', daysLeft: 80, stock: 75 },
]

// --- Color map ---
const kpiColors = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200/60', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  sky: { bg: 'bg-sky-50', border: 'border-sky-200/60', text: 'text-sky-600', badge: 'bg-sky-100 text-sky-700' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200/60', text: 'text-violet-600', badge: 'bg-violet-100 text-violet-700' },
  slate: { bg: 'bg-slate-50', border: 'border-slate-200/60', text: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200/60', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200/60', text: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const maxSalesValue = Math.max(...salesChartData.map(d => Math.max(d.sales, d.purchases)))
  const maxSold = Math.max(...topSellingMedicines.map(m => m.sold))

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header + Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* ZONE 1: Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/billing')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Bill
          </button>
          <button
            onClick={() => navigate('/purchase-entry')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Purchase Entry
          </button>
          <button
            onClick={() => navigate('/medicines/add')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Add Medicine
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Reports
          </button>
        </div>
      </div>

      {/* ZONE 2: KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => {
          const colors = kpiColors[kpi.color]
          return (
            <div
              key={kpi.label}
              onClick={() => {
                if (kpi.label === 'Low Stock Items') navigate('/medicines')
                if (kpi.label === 'Expiring in 30d') navigate('/expiry-alerts')
              }}
              className={`bg-white rounded-xl p-4 border transition-all hover:shadow-md ${colors.border} ${kpi.clickable ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{kpi.icon}</span>
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${kpi.trend === 'up' && (kpi.color === 'rose' || kpi.color === 'amber')
                    ? 'bg-rose-50 text-rose-600'
                    : kpi.trend === 'up'
                      ? 'bg-emerald-50 text-emerald-600'
                      : kpi.color === 'amber'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                  }`}>
                  {kpi.trend === 'up' ? '↑' : '↓'} {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 tracking-tight">{kpi.value}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">{kpi.label}</p>
            </div>
          )
        })}
      </div>

      {/* ZONE 3: Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales vs Purchases Chart */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-800">Sales vs Purchases</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 days comparison</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span className="text-slate-500">Sales</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-400"></span>
                <span className="text-slate-500">Purchases</span>
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex items-end gap-3 h-[180px]">
            {salesChartData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-1 h-[150px]">
                  <div
                    className="flex-1 bg-emerald-400 rounded-t-md transition-all hover:bg-emerald-500 relative group"
                    style={{ height: `${(d.sales / maxSalesValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      ₹{(d.sales / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div
                    className="flex-1 bg-sky-300 rounded-t-md transition-all hover:bg-sky-400 relative group"
                    style={{ height: `${(d.purchases / maxSalesValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      ₹{(d.purchases / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Medicines */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-800">Top Selling Medicines</h2>
              <p className="text-xs text-slate-400 mt-0.5">This month's best sellers</p>
            </div>
            <span className="text-xs text-slate-400">Units sold</span>
          </div>

          <div className="space-y-4">
            {topSellingMedicines.map((med, i) => (
              <div key={med.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-emerald-100 text-emerald-700' :
                        i === 1 ? 'bg-sky-100 text-sky-700' :
                          i === 2 ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-500'
                      }`}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700">{med.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800">{med.sold}</span>
                    <span className="text-[11px] text-slate-400 ml-1.5">₹{med.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${i === 0 ? 'bg-emerald-400' : i === 1 ? 'bg-sky-400' : i === 2 ? 'bg-amber-400' : 'bg-slate-300'
                      }`}
                    style={{ width: `${(med.sold / maxSold) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ZONE 4: Operational Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Sales */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/60">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-semibold text-slate-800">Recent Sales</h2>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-md">Live</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentSales.map((sale) => (
              <div key={sale.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{sale.id}</p>
                    <p className="text-xs text-slate-400">{sale.customer} • {sale.items} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{sale.total}</p>
                  <p className="text-[11px] text-slate-400">{sale.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <button onClick={() => navigate('/billing')} className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">View all sales →</button>
          </div>
        </div>

        {/* Right Panel: Low Stock + Expiry Alerts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Low Stock */}
          <div className="bg-white rounded-xl border border-amber-200/60">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="font-semibold text-slate-800">Low Stock</h2>
              </div>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs font-bold rounded-md">{lowStockItems.length}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {lowStockItems.map((item) => (
                <div key={item.name} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.batch}</p>
                    </div>
                    <span className={`text-xs font-bold ${item.stock <= 10 ? 'text-rose-600' : 'text-amber-600'}`}>{item.stock} left</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all ${item.stock <= 10 ? 'bg-rose-400' : 'bg-amber-400'}`}
                      style={{ width: `${Math.min((item.stock / item.minStock) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <button onClick={() => navigate('/medicines')} className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">Manage stock →</button>
            </div>
          </div>

          {/* Expiry Alerts */}
          <div className="bg-white rounded-xl border border-rose-200/60">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-semibold text-slate-800">Expiry Alerts</h2>
              </div>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-md animate-pulse">{expiryAlerts.length}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {expiryAlerts.map((item) => (
                <div key={item.batch} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.name}</p>
                    <p className="text-[10px] text-slate-400">
                      <span className="font-mono">{item.batch}</span> • Exp: {item.expiry}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${item.daysLeft <= 30 ? 'bg-rose-100 text-rose-700' :
                      item.daysLeft <= 60 ? 'bg-amber-100 text-amber-700' :
                        'bg-sky-100 text-sky-700'
                    }`}>
                    {item.daysLeft}d
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <button onClick={() => navigate('/expiry-alerts')} className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">View all alerts →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
