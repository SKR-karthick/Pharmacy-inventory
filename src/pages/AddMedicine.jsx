import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMedicines } from '../context/MedicinesContext'

export default function AddMedicine() {
  const navigate = useNavigate()
  const { addMedicine } = useMedicines()
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    category: '',
    batchNumber: '',
    expiryDate: '',
    packsQty: '',
    unitsPerPack: '10',
    purchaseUnit: 'Strip',
    sellingUnit: 'Tablet',
    costPerPack: '',
    sellingPricePerUnit: '',
    supplier: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const packs = parseInt(formData.packsQty) || 0
  const unitsPerPack = parseInt(formData.unitsPerPack) || 10
  const totalUnits = packs * unitsPerPack
  const costPack = parseFloat(formData.costPerPack) || 0
  const costPerUnit = unitsPerPack > 0 ? costPack / unitsPerPack : 0
  const sellPerUnit = parseFloat(formData.sellingPricePerUnit) || 0
  const profitPerUnit = sellPerUnit - costPerUnit

  const handleSubmit = (e) => {
    e.preventDefault()
    addMedicine({
      name: formData.name,
      barcode: formData.barcode,
      category: formData.category,
      batchNo: formData.batchNumber,
      expiry: formData.expiryDate,
      purchaseUnit: formData.purchaseUnit,
      sellingUnit: formData.sellingUnit,
      unitsPerPack: unitsPerPack,
      costPerPack: costPack,
      sellingPricePerUnit: sellPerUnit,
      totalStockUnits: totalUnits,
      quantity: packs,
      purchasePrice: Math.round(costPerUnit * 100) / 100,
      sellingPrice: sellPerUnit,
      supplier: formData.supplier,
    })
    alert('Medicine added successfully!')
    navigate('/medicines')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/medicines"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add Medicine</h1>
          <p className="mt-1 text-sm text-gray-500">Enter medicine details to add to inventory</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medicine Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Paracetamol 500mg"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Barcode */}
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-2">
              Barcode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              required
              placeholder="e.g., 8901234567890"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              <option value="">Select category</option>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Gastro">Gastro</option>
              <option value="Allergy">Allergy</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Cardiac">Cardiac</option>
              <option value="Vitamins">Vitamins</option>
              <option value="Respiratory">Respiratory</option>
            </select>
          </div>

          {/* Batch Number */}
          <div>
            <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Batch Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="batchNumber"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              required
              placeholder="e.g., BTH-2026-001"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Supplier */}
          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-2">
              Supplier <span className="text-red-500">*</span>
            </label>
            <select
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              <option value="">Select supplier</option>
              <option value="MedSupply Co.">MedSupply Co.</option>
              <option value="PharmaDist Ltd.">PharmaDist Ltd.</option>
              <option value="HealthCare Plus">HealthCare Plus</option>
              <option value="MediWholesale">MediWholesale</option>
            </select>
          </div>
        </div>

        {/* Pack / Unit Configuration */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Pack & Unit Configuration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Purchase Unit</label>
              <select name="purchaseUnit" value={formData.purchaseUnit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                <option value="Strip">Strip</option>
                <option value="Box">Box</option>
                <option value="Bottle">Bottle</option>
                <option value="Pack">Pack</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Selling Unit</label>
              <select name="sellingUnit" value={formData.sellingUnit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="ml">ml</option>
                <option value="Unit">Unit</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Units per {formData.purchaseUnit}</label>
              <input type="number" name="unitsPerPack" value={formData.unitsPerPack} onChange={handleChange} min="1" required placeholder="10" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">No. of {formData.purchaseUnit}s</label>
              <input type="number" name="packsQty" value={formData.packsQty} onChange={handleChange} min="1" required placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pricing
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Cost per {formData.purchaseUnit} (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" name="costPerPack" value={formData.costPerPack} onChange={handleChange} min="0" step="0.01" required placeholder="0.00" className="w-full pl-7 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Selling Price per {formData.sellingUnit} (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" name="sellingPricePerUnit" value={formData.sellingPricePerUnit} onChange={handleChange} min="0" step="0.01" required placeholder="0.00" className="w-full pl-7 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Auto-calculated Summary */}
        {(packs > 0 || costPack > 0) && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-emerald-600 text-[11px] font-medium uppercase">Total Units</p>
                <p className="text-emerald-800 font-bold">{totalUnits} {formData.sellingUnit}s</p>
              </div>
              <div>
                <p className="text-emerald-600 text-[11px] font-medium uppercase">Cost/Unit</p>
                <p className="text-emerald-800 font-bold">₹{costPerUnit.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-emerald-600 text-[11px] font-medium uppercase">Profit/Unit</p>
                <p className={`font-bold ${profitPerUnit >= 0 ? 'text-emerald-800' : 'text-rose-600'}`}>₹{profitPerUnit.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-emerald-600 text-[11px] font-medium uppercase">Margin</p>
                <p className={`font-bold ${profitPerUnit >= 0 ? 'text-emerald-800' : 'text-rose-600'}`}>
                  {costPerUnit > 0 ? ((profitPerUnit / costPerUnit) * 100).toFixed(1) : '0.0'}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-4">
          <Link
            to="/medicines"
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            Add Medicine
          </button>
        </div>
      </form>
    </div>
  )
}
