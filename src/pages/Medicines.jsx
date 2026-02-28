import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMedicines } from '../context/MedicinesContext'

const LOW_STOCK_THRESHOLD = 20

// Format: "8 Strips (80 Tablets)"
function formatStock(totalUnits, unitsPerPack, purchaseUnit = 'Strip', sellingUnit = 'Tablet') {
  if (!unitsPerPack || unitsPerPack <= 0) return `${totalUnits} ${sellingUnit}s`
  const packs = Math.floor(totalUnits / unitsPerPack)
  const loose = totalUnits % unitsPerPack
  if (packs === 0 && loose === 0) return `0 ${sellingUnit}s`
  if (packs === 0) return `${loose} ${sellingUnit}s`
  if (loose === 0) return `${packs} ${purchaseUnit}s (${totalUnits} ${sellingUnit}s)`
  return `${packs} ${purchaseUnit}s + ${loose} (${totalUnits} ${sellingUnit}s)`
}

export default function Medicines() {
  const { medicines, deleteMedicine } = useMedicines()
  const [searchTerm, setSearchTerm] = useState('')
  const [stockView, setStockView] = useState('packs') // 'packs' | 'units'

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.barcode.includes(searchTerm)
  )

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      deleteMedicine(id)
    }
  }

  const isLowStock = (med) => {
    const units = med.totalStockUnits ?? (med.quantity * (med.unitsPerPack || 10))
    return units <= LOW_STOCK_THRESHOLD
  }

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Medicines</h1>
          <p className="text-slate-500 text-sm mt-0.5">Inventory management</p>
        </div>
        <Link
          to="/medicines/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Medicine
        </Link>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, batch, or barcode..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          {/* Stock View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setStockView('packs')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${stockView === 'packs' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Packs
            </button>
            <button
              onClick={() => setStockView('units')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${stockView === 'units' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Units
            </button>
          </div>
          <span className="text-slate-500 text-sm">{medicines.length} items</span>
          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-xs font-medium">
            {medicines.filter(m => isLowStock(m)).length} low stock
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Medicine</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Barcode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Batch</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Expiry</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Cost/Tablet</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Sell/Tablet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((medicine) => {
                const totalUnits = medicine.totalStockUnits ?? (medicine.quantity * (medicine.unitsPerPack || 10))
                const unitsPP = medicine.unitsPerPack || 10
                const pUnit = medicine.purchaseUnit || 'Strip'
                const sUnit = medicine.sellingUnit || 'Tablet'
                const low = isLowStock(medicine)
                const costPerTablet = medicine.costPerPack ? (medicine.costPerPack / unitsPP) : medicine.purchasePrice
                const sellPerTablet = medicine.sellingPricePerUnit || medicine.sellingPrice

                return (
                  <tr key={medicine.id} className={`hover:bg-slate-50/50 transition-colors ${low ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link to={`/medicines/${medicine.id}`} className="text-sm font-medium text-slate-800 hover:text-emerald-600 transition-colors cursor-pointer">{medicine.name}</Link>
                        {low && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">LOW</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <code className="text-xs font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{medicine.barcode}</code>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500 font-mono text-xs">{medicine.batchNo}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{medicine.expiry}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-xs font-medium ${low ? 'text-amber-600' : 'text-slate-700'}`}>
                        {stockView === 'packs'
                          ? formatStock(totalUnits, unitsPP, pUnit, sUnit)
                          : `${totalUnits} ${sUnit}s`
                        }
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm text-slate-500">₹{costPerTablet?.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-medium text-slate-700">₹{sellPerTablet}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{medicine.supplier}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/medicines/edit/${medicine.id}`} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Link>
                        <button onClick={() => handleDelete(medicine.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filteredMedicines.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-400 text-sm">No medicines found</p>
          </div>
        )}
      </div>
    </div>
  )
}
