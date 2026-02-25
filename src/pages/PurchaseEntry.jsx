import { useState, useRef, useEffect, useCallback } from 'react'
import { useMedicines } from '../context/MedicinesContext'

const suppliers = ['MedSupply Co.', 'PharmaDist Ltd.', 'HealthCare Plus', 'MediWholesale']

export default function PurchaseEntry() {
  const { findByBarcode } = useMedicines()

  const [entries, setEntries] = useState([
    { id: 1, medicine: '', batchNo: '', quantity: '', purchasePrice: '', sellingPrice: '', expiryDate: '', supplierName: '', scanned: false }
  ])
  const [supplier, setSupplier] = useState('')
  const [invoiceNo, setInvoiceNo] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [barcodeInput, setBarcodeInput] = useState('')
  const [scanStatus, setScanStatus] = useState(null) // { type: 'found'|'not-found', name?: string }
  const [scanCount, setScanCount] = useState(0)
  const barcodeRef = useRef(null)
  const formRef = useRef(null)
  const scanTimerRef = useRef(null)

  // Clear scan status after a delay
  useEffect(() => {
    if (scanStatus) {
      const timer = setTimeout(() => setScanStatus(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [scanStatus])

  // Core scan processing — called on Enter key or auto-detect
  const processScan = useCallback((barcode) => {
    const trimmed = barcode.trim()
    if (!trimmed) return

    const found = findByBarcode(trimmed)
    if (found) {
      setEntries((prev) => {
        const firstEntry = prev[0]
        const isFirstEmpty = prev.length === 1 && !firstEntry.medicine && !firstEntry.batchNo && !firstEntry.quantity

        const newRow = {
          id: isFirstEmpty ? firstEntry.id : Date.now(),
          medicine: found.name,
          batchNo: found.batchNo || '',
          quantity: '',
          purchasePrice: found.purchasePrice?.toString() || '',
          sellingPrice: found.sellingPrice?.toString() || '',
          expiryDate: found.expiry || '',
          supplierName: found.supplier || '',
          scanned: true,
        }

        if (isFirstEmpty) {
          return [newRow]
        } else {
          return [...prev, newRow]
        }
      })

      setScanStatus({ type: 'found', name: found.name })
      setScanCount((c) => c + 1)

      // Remove highlight after animation
      setTimeout(() => {
        setEntries((prev) => prev.map((e) => ({ ...e, scanned: false })))
      }, 1500)
    } else {
      setScanStatus({ type: 'not-found' })
    }

    // Clear input for next scan
    setBarcodeInput('')

    // Refocus barcode input
    setTimeout(() => {
      barcodeRef.current?.focus()
    }, 50)
  }, [findByBarcode])

  // Handle Enter key — real barcode scanners send Enter after barcode
  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Clear any pending auto-detect timer
      if (scanTimerRef.current) {
        clearTimeout(scanTimerRef.current)
        scanTimerRef.current = null
      }
      processScan(barcodeInput)
    }
  }

  // Handle input change — auto-detect when barcode is long enough
  const handleBarcodeChange = (e) => {
    const value = e.target.value
    setBarcodeInput(value)

    // Clear previous auto-detect timer
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current)
      scanTimerRef.current = null
    }

    // Auto-trigger if barcode is long enough (most barcodes are 8-13 digits)
    // Use debounce: wait 400ms after last keystroke for scanner to finish
    if (value.trim().length >= 13) {
      scanTimerRef.current = setTimeout(() => {
        processScan(value)
        scanTimerRef.current = null
      }, 400)
    }
  }

  // Smart blur handler — only refocus if user clicked OUTSIDE the form
  const handleBarcodeBlur = (e) => {
    // Check if the newly focused element is inside our form
    // If so, don't steal focus — let user edit fields
    setTimeout(() => {
      const activeEl = document.activeElement
      if (formRef.current && formRef.current.contains(activeEl)) {
        // User clicked another field in the form — don't interfere
        return
      }
      // User clicked outside the form — refocus barcode input
      barcodeRef.current?.focus()
    }, 150)
  }

  const addRow = () => {
    setEntries([...entries, {
      id: Date.now(),
      medicine: '',
      batchNo: '',
      quantity: '',
      purchasePrice: '',
      sellingPrice: '',
      expiryDate: '',
      supplierName: '',
      scanned: false
    }])
  }

  const removeRow = (id) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id))
    }
  }

  const updateEntry = (id, field, value) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const totalAmount = entries.reduce((sum, e) => {
    return sum + (parseFloat(e.quantity || 0) * parseFloat(e.purchasePrice || 0))
  }, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ supplier, invoiceNo, invoiceDate, entries })
    alert('Purchase entry saved successfully!')
    setEntries([{ id: 1, medicine: '', batchNo: '', quantity: '', purchasePrice: '', sellingPrice: '', expiryDate: '', supplierName: '', scanned: false }])
    setSupplier('')
    setInvoiceNo('')
    setScanCount(0)
    setBarcodeInput('')
    barcodeRef.current?.focus()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Purchase Entry</h1>
        <p className="mt-1 text-sm text-gray-500">Record new medicine purchases from suppliers</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="">Select supplier</option>
                {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                required
                placeholder="e.g., INV-2026-001"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date *</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Medicine Entries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Medicine Items</h2>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Row
            </button>
          </div>

          {/* Barcode Scanner Input */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-lg">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                  </svg>
                </div>
                <input
                  ref={barcodeRef}
                  type="text"
                  value={barcodeInput}
                  onChange={handleBarcodeChange}
                  onKeyDown={handleBarcodeKeyDown}
                  onBlur={handleBarcodeBlur}
                  placeholder="Scan medicine barcode..."
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 transition-all ${scanStatus?.type === 'found'
                    ? 'border-emerald-400 focus:ring-emerald-500/20 bg-emerald-50'
                    : scanStatus?.type === 'not-found'
                      ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50'
                      : 'border-gray-200 focus:ring-teal-500 bg-white'
                    }`}
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {/* Scan status */}
              {scanStatus?.type === 'found' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl animate-pulse">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-medium text-emerald-700">{scanStatus.name} added</span>
                </div>
              )}
              {scanStatus?.type === 'not-found' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-xs font-medium text-rose-700">Medicine not found</span>
                </div>
              )}
              {!scanStatus && (
                <div className="hidden sm:flex items-center gap-2">
                  {scanCount > 0 && (
                    <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-lg border border-teal-200">
                      {scanCount} scanned
                    </span>
                  )}
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    Scan or type barcode + <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 text-[10px] font-mono border border-gray-200">Enter</kbd>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Medicine Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Batch No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expiry</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Unit Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Supplier</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <tr key={entry.id} className={`transition-colors duration-700 ${entry.scanned ? 'bg-emerald-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={entry.medicine}
                        onChange={(e) => updateEntry(entry.id, 'medicine', e.target.value)}
                        placeholder="Medicine name"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={entry.batchNo}
                        onChange={(e) => updateEntry(entry.id, 'batchNo', e.target.value)}
                        placeholder="BTH-XXX"
                        className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={entry.expiryDate}
                        onChange={(e) => updateEntry(entry.id, 'expiryDate', e.target.value)}
                        className="w-36 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        value={entry.quantity}
                        onChange={(e) => updateEntry(entry.id, 'quantity', e.target.value)}
                        placeholder="0"
                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={entry.purchasePrice}
                        onChange={(e) => updateEntry(entry.id, 'purchasePrice', e.target.value)}
                        placeholder="0.00"
                        className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ₹{((entry.quantity || 0) * (entry.purchasePrice || 0)).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{entry.supplierName || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeRow(entry.id)}
                        disabled={entries.length === 1}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-right font-semibold text-gray-700">Grand Total:</td>
                  <td className="px-4 py-3 text-right font-bold text-lg text-teal-600">₹{totalAmount.toFixed(2)}</td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            Save Purchase Entry
          </button>
        </div>
      </form>
    </div>
  )
}
