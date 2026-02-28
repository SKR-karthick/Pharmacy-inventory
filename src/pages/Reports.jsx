import { useState } from 'react'
import { useInvoices } from '../context/InvoicesContext'
import { useMedicines } from '../context/MedicinesContext'

const dateRanges = ['Today', 'This Week', 'This Month', 'This Quarter']

function getDaysUntilExpiry(expiryDate) {
  if (!expiryDate) return 999
  const today = new Date()
  const expiry = new Date(expiryDate)
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
}

export default function Reports() {
  const { invoices, totalSales, totalItems: totalItemsSold, totalProfit } = useInvoices()
  const { medicines } = useMedicines()
  const [activeRange, setActiveRange] = useState('This Month')
  const [activeTab, setActiveTab] = useState('sales')

  // --- Filter invoices by date range ---
  const filterByRange = (inv) => {
    const today = new Date()
    const invDate = new Date(inv.date)
    switch (activeRange) {
      case 'Today': return invDate.toDateString() === today.toDateString()
      case 'This Week': {
        const weekAgo = new Date(today)
        weekAgo.setDate(today.getDate() - 7)
        return invDate >= weekAgo
      }
      case 'This Month': {
        return invDate.getMonth() === today.getMonth() && invDate.getFullYear() === today.getFullYear()
      }
      case 'This Quarter': {
        const qStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)
        return invDate >= qStart
      }
      default: return true
    }
  }

  const filteredInvoices = invoices.filter(filterByRange)
  const filteredSales = filteredInvoices.reduce((s, inv) => s + (inv.total || 0), 0)
  const filteredProfit = filteredInvoices.reduce((s, inv) => s + (inv.profit || 0), 0)
  const filteredItemsSold = filteredInvoices.reduce((s, inv) => s + (inv.itemCount || 0), 0)
  const margin = filteredSales > 0 ? ((filteredProfit / filteredSales) * 100).toFixed(1) : '0.0'

  // --- Top sellers (from saved invoices) ---
  const medicineSalesMap = {}
  filteredInvoices.forEach(inv => {
    if (inv.items) {
      inv.items.forEach(item => {
        if (!medicineSalesMap[item.name]) {
          medicineSalesMap[item.name] = { name: item.name, sold: 0, revenue: 0 }
        }
        medicineSalesMap[item.name].sold += item.actualUnits || item.qty || 0
        medicineSalesMap[item.name].revenue += item.total || 0
      })
    }
  })
  const topSellingMedicines = Object.values(medicineSalesMap).sort((a, b) => b.sold - a.sold).slice(0, 5)

  // --- Expiry alerts from live context ---
  const expiringMedicines = medicines
    .map(m => ({
      name: m.name,
      batch: m.batchNo,
      expiry: m.expiry,
      stock: m.totalStockUnits ?? (m.quantity * (m.unitsPerPack || 10)),
      daysLeft: getDaysUntilExpiry(m.expiry)
    }))
    .filter(m => m.daysLeft > 0 && m.daysLeft <= 90)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  // --- Inventory value from live context ---
  const categoryMap = {}
  medicines.forEach(m => {
    const cat = m.category || 'Other'
    if (!categoryMap[cat]) categoryMap[cat] = { category: cat, items: 0, value: 0 }
    categoryMap[cat].items += 1
    const units = m.totalStockUnits ?? (m.quantity * (m.unitsPerPack || 10))
    const costPerUnit = m.costPerPack ? (m.costPerPack / (m.unitsPerPack || 10)) : m.purchasePrice
    categoryMap[cat].value += units * costPerUnit
  })
  const categoryStock = Object.values(categoryMap).sort((a, b) => b.value - a.value)
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

      {/* Summary Cards — LIVE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-600">Total Sales</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">₹{filteredSales.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{filteredInvoices.length} invoices</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-600">Net Profit</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">₹{filteredProfit.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{margin}% margin</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-600">Items Sold</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">{filteredItemsSold}</p>
          <p className="text-xs text-slate-400 mt-1">across {filteredInvoices.length} orders</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-sky-50 text-sky-600">Stock Value</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">₹{Math.round(totalStockValue).toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{medicines.length} medicines</p>
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

      {/* Sales Report — LIVE from InvoicesContext */}
      {activeTab === 'sales' && (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          {filteredInvoices.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-slate-400 text-sm">No invoices found for this period. Create a bill to see sales here.</p>
            </div>
          ) : (
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
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((sale) => (
                    <tr key={sale.id || sale.timestamp} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-emerald-600">{sale.id}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-500">{sale.date}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-700">{sale.customer}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-500">{sale.doctor || '—'}</td>
                      <td className="px-4 py-3.5 text-sm text-center text-slate-600">{sale.itemCount}</td>
                      <td className="px-4 py-3.5 text-sm text-right font-semibold text-slate-800">₹{(sale.total || 0).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${sale.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {sale.status === 'paid' ? 'PAID' : 'UNPAID'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200">
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-sm font-semibold text-slate-700">Total</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-slate-700">{filteredItemsSold}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-emerald-600">₹{filteredSales.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Top Sellers — LIVE from invoices */}
      {activeTab === 'top' && (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          {topSellingMedicines.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-slate-400 text-sm">No sales data yet. Bill some medicines to see top sellers.</p>
            </div>
          ) : (
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
                    const maxSold = topSellingMedicines[0].sold || 1
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
          )}
        </div>
      )}

      {/* Expiry Alerts — LIVE from MedicinesContext */}
      {activeTab === 'expiry' && (
        <div className="space-y-4">
          {expiringMedicines.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/60 px-6 py-16 text-center">
              <p className="text-emerald-600 text-sm font-medium">✓ No medicines expiring within 90 days</p>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* Inventory Value — LIVE from MedicinesContext */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Total Inventory Value</h3>
              <span className="text-2xl font-bold text-emerald-600">₹{Math.round(totalStockValue).toLocaleString()}</span>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden bg-slate-100">
              {categoryStock.map((cat, i) => {
                const colors = ['bg-emerald-400', 'bg-sky-400', 'bg-violet-400', 'bg-amber-400', 'bg-rose-400', 'bg-teal-400', 'bg-indigo-400']
                return (
                  <div
                    key={cat.category}
                    className={`${colors[i % colors.length]} transition-all`}
                    style={{ width: `${totalStockValue > 0 ? (cat.value / totalStockValue) * 100 : 0}%` }}
                    title={`${cat.category}: ₹${Math.round(cat.value).toLocaleString()}`}
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
                          <span className={`w-2.5 h-2.5 rounded-full ${dotColors[i % dotColors.length]}`}></span>
                          <span className="text-sm font-medium text-slate-700">{cat.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-center text-slate-600">{cat.items}</td>
                      <td className="px-4 py-3.5 text-sm text-right font-semibold text-slate-800">₹{Math.round(cat.value).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-sm text-right text-slate-500">{totalStockValue > 0 ? ((cat.value / totalStockValue) * 100).toFixed(1) : '0.0'}%</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-700">Total</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-slate-700">{categoryStock.reduce((s, c) => s + c.items, 0)}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-emerald-600">₹{Math.round(totalStockValue).toLocaleString()}</td>
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
