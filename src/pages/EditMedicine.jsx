import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMedicines } from '../context/MedicinesContext'

export default function EditMedicine() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { findById, updateMedicine } = useMedicines()
    const [notFound, setNotFound] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        category: '',
        batchNumber: '',
        expiryDate: '',
        quantity: '',
        purchasePrice: '',
        sellingPrice: '',
        supplier: '',
    })

    useEffect(() => {
        const medicine = findById(parseInt(id))
        if (medicine) {
            setFormData({
                name: medicine.name || '',
                barcode: medicine.barcode || '',
                category: medicine.category || '',
                batchNumber: medicine.batchNo || '',
                expiryDate: medicine.expiry || '',
                quantity: medicine.quantity?.toString() || '',
                purchasePrice: medicine.purchasePrice?.toString() || '',
                sellingPrice: medicine.sellingPrice?.toString() || '',
                supplier: medicine.supplier || '',
            })
        } else {
            setNotFound(true)
        }
    }, [id, findById])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        updateMedicine(parseInt(id), {
            name: formData.name,
            barcode: formData.barcode,
            category: formData.category,
            batchNo: formData.batchNumber,
            expiry: formData.expiryDate,
            quantity: parseInt(formData.quantity) || 0,
            purchasePrice: parseFloat(formData.purchasePrice) || 0,
            sellingPrice: parseFloat(formData.sellingPrice) || 0,
            supplier: formData.supplier,
        })
        alert('Medicine updated successfully!')
        navigate('/medicines')
    }

    if (notFound) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Medicine Not Found</h2>
                <p className="text-gray-500 mb-6">The medicine you're looking for doesn't exist.</p>
                <Link to="/medicines" className="px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                    Back to Medicines
                </Link>
            </div>
        )
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
                    <h1 className="text-2xl font-semibold text-gray-900">Edit Medicine</h1>
                    <p className="mt-1 text-sm text-gray-500">Update medicine details</p>
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
                        <div className="relative">
                            <svg className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                            </svg>
                            <input
                                type="text"
                                id="barcode"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 8901234567890"
                                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
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

                    {/* Quantity */}
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="e.g., 100"
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

                    {/* Purchase Price */}
                    <div>
                        <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-2">
                            Purchase Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                type="number"
                                id="purchasePrice"
                                name="purchasePrice"
                                value={formData.purchasePrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Selling Price */}
                    <div>
                        <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                            Selling Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                type="number"
                                id="sellingPrice"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Profit Margin Display */}
                {formData.purchasePrice && formData.sellingPrice && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Profit Margin:</span>
                            <span className={`font-semibold ${((formData.sellingPrice - formData.purchasePrice) / formData.purchasePrice * 100) >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                                }`}>
                                {((formData.sellingPrice - formData.purchasePrice) / formData.purchasePrice * 100).toFixed(1)}%
                                (₹{(formData.sellingPrice - formData.purchasePrice).toFixed(2)} per unit)
                            </span>
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
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}
