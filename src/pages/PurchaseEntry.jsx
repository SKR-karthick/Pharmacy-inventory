import { useState, useRef, useEffect, useCallback } from 'react'
import { useMedicines } from '../context/MedicinesContext'

const suppliers = ['MedSupply Co.', 'PharmaDist Ltd.', 'HealthCare Plus', 'MediWholesale']

export default function PurchaseEntry() {
  const { medicines, findByBarcode, addStock, addMedicine } = useMedicines()

  const emptyRow = { id: 1, medicineId: null, medicine: '', batchNo: '', strips: '', costPerStrip: '', unitsPerStrip: '10', expiryDate: '', supplierName: '', scanned: false }

  const [entries, setEntries] = useState([{ ...emptyRow }])
  const [supplier, setSupplier] = useState('')
  const [invoiceNo, setInvoiceNo] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [barcodeInput, setBarcodeInput] = useState('')
  const [scanStatus, setScanStatus] = useState(null)
  const [scanCount, setScanCount] = useState(0)
  const [toast, setToast] = useState(null)
  const barcodeRef = useRef(null)
  const formRef = useRef(null)
  const scanTimerRef = useRef(null)

  useEffect(() => {
    if (scanStatus) {
      const timer = setTimeout(() => setScanStatus(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [scanStatus])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const processScan = useCallback((barcode) => {
    const trimmed = barcode.trim()
    if (!trimmed) return

    const found = findByBarcode(trimmed)
    if (found) {
      setEntries((prev) => {
        const firstEntry = prev[0]
        const isFirstEmpty = prev.length === 1 && !firstEntry.medicine && !firstEntry.strips

        const newRow = {
          id: isFirstEmpty ? firstEntry.id : Date.now(),
          medicineId: found.id,
          medicine: found.name,
          batchNo: found.batchNo || '',
          strips: '',
          costPerStrip: found.costPerPack?.toString() || '',
          unitsPerStrip: (found.unitsPerPack || 10).toString(),
          expiryDate: found.expiry || '',
          supplierName: found.supplier || '',
          scanned: true,
        }

        return isFirstEmpty ? [newRow] : [...prev, newRow]
      })

      setScanStatus({ type: 'found', name: found.name })
      setScanCount((c) => c + 1)

      setTimeout(() => {
        setEntries((prev) => prev.map((e) => ({ ...e, scanned: false })))
      }, 1500)
    } else {
      setScanStatus({ type: 'not-found' })
    }

    setBarcodeInput('')
    setTimeout(() => barcodeRef.current?.focus(), 50)
  }, [findByBarcode])

  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (scanTimerRef.current) { clearTimeout(scanTimerRef.current); scanTimerRef.current = null }
      processScan(barcodeInput)
    }
  }

  const handleBarcodeChange = (e) => {
    const value = e.target.value
    setBarcodeInput(value)
    if (scanTimerRef.current) { clearTimeout(scanTimerRef.current); scanTimerRef.current = null }
    if (value.trim().length >= 13) {
      scanTimerRef.current = setTimeout(() => { processScan(value); scanTimerRef.current = null }, 400)
    }
  }

  const handleBarcodeBlur = () => {
    setTimeout(() => {
      const activeEl = document.activeElement
      if (formRef.current && formRef.current.contains(activeEl)) return
      barcodeRef.current?.focus()
    }, 150)
  }

  const addRow = () => {
    setEntries([...entries, { ...emptyRow, id: Date.now() }])
  }

  const removeRow = (id) => {
    if (entries.length > 1) setEntries(entries.filter(e => e.id !== id))
  }

  const updateEntry = (id, field, value) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  // Match medicine by name for manual entries
  const findMedicineByName = (name) => {
    return medicines.find(m => m.name.toLowerCase() === name.toLowerCase().trim()) || null
  }

  const totalAmount = entries.reduce((sum, e) => {
    const strips = parseFloat(e.strips || 0)
    const cost = parseFloat(e.costPerStrip || 0)
    return sum + (strips * cost)
  }, 0)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Process each entry and add stock
    let processed = 0
    entries.forEach(entry => {
      const strips = parseInt(entry.strips) || 0
      const costPerStrip = parseFloat(entry.costPerStrip) || 0
      const unitsPerStrip = parseInt(entry.unitsPerStrip) || 10

      if (strips <= 0 || !entry.medicine) return

      // Find medicine by ID or name
      let med = entry.medicineId ? medicines.find(m => m.id === entry.medicineId) : findMedicineByName(entry.medicine)

      if (med) {
        // Existing medicine — update stock
        addStock(med.id, strips, costPerStrip, unitsPerStrip)
        processed++
      } else {
        // New medicine — create it with purchase data
        const totalTablets = strips * unitsPerStrip
        const costPerUnit = unitsPerStrip > 0 ? Math.round((costPerStrip / unitsPerStrip) * 100) / 100 : 0
        addMedicine({
          name: entry.medicine,
          barcode: '',
          category: '',
          batchNo: entry.batchNo || '',
          expiry: entry.expiryDate || '',
          purchaseUnit: 'Strip',
          sellingUnit: 'Tablet',
          unitsPerPack: unitsPerStrip,
          costPerPack: costPerStrip,
          sellingPricePerUnit: costPerUnit, // default selling = cost, user can edit later
          totalStockUnits: totalTablets,
          quantity: strips,
          purchasePrice: costPerUnit,
          sellingPrice: costPerUnit,
          supplier: entry.supplierName || supplier || '',
        })
        processed++
      }
    })

    if (processed > 0) {
      setToast({ message: `${processed} item(s) stock updated — ${entries.reduce((s, e) => s + (parseInt(e.strips || 0) * parseInt(e.unitsPerStrip || 10)), 0)} tablets added`, type: 'success' })
    } else {
      setToast({ message: 'No valid entries to process', type: 'warning' })
      return
    }

    setEntries([{ ...emptyRow }])
    setSupplier('')
    setInvoiceNo('')
    setScanCount(0)
    setBarcodeInput('')
    barcodeRef.current?.focus()
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border animate-slide-in ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={toast.type === 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'} />
          </svg>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Purchase Entry</h1>
        <p className="mt-1 text-sm text-gray-500">Record new medicine purchases from suppliers (pack → tablet conversion)</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
              <select value={supplier} onChange={(e) => setSupplier(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                <option value="">Select supplier</option>
                {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
              <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} required placeholder="e.g., INV-2026-001" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date *</label>
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
        </div>

        {/* Medicine Entries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Medicine Items</h2>
            <button type="button" onClick={addRow} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Row
            </button>
          </div>

          {/* Barcode Scanner */}
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
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 transition-all ${scanStatus?.type === 'found' ? 'border-emerald-400 focus:ring-emerald-500/20 bg-emerald-50' : scanStatus?.type === 'not-found' ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50' : 'border-gray-200 focus:ring-teal-500 bg-white'}`}
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {scanStatus?.type === 'found' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl animate-pulse">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-xs font-medium text-emerald-700">{scanStatus.name} added</span>
                </div>
              )}
              {scanStatus?.type === 'not-found' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <span className="text-xs font-medium text-rose-700">Medicine not found</span>
                </div>
              )}
              {!scanStatus && scanCount > 0 && (
                <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-lg border border-teal-200">{scanCount} scanned</span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Medicine Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Batch No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expiry</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Strips</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Units/Strip</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Cost/Strip</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Tablets</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => {
                  const strips = parseInt(entry.strips || 0)
                  const units = parseInt(entry.unitsPerStrip || 10)
                  const totalTablets = strips * units
                  const costStrip = parseFloat(entry.costPerStrip || 0)
                  const lineTotal = strips * costStrip
                  return (
                    <tr key={entry.id} className={`transition-colors duration-700 ${entry.scanned ? 'bg-emerald-50' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="text" value={entry.medicine} onChange={(e) => updateEntry(entry.id, 'medicine', e.target.value)} placeholder="Medicine name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" value={entry.batchNo} onChange={(e) => updateEntry(entry.id, 'batchNo', e.target.value)} placeholder="BTH-XXX" className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="date" value={entry.expiryDate} onChange={(e) => updateEntry(entry.id, 'expiryDate', e.target.value)} className="w-36 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min="1" value={entry.strips} onChange={(e) => updateEntry(entry.id, 'strips', e.target.value)} placeholder="0" className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min="1" value={entry.unitsPerStrip} onChange={(e) => updateEntry(entry.id, 'unitsPerStrip', e.target.value)} placeholder="10" className="w-16 px-2 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min="0" step="0.01" value={entry.costPerStrip} onChange={(e) => updateEntry(entry.id, 'costPerStrip', e.target.value)} placeholder="0.00" className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₹{lineTotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${totalTablets > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-gray-400'}`}>
                          {totalTablets > 0 ? `${totalTablets} tab` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => removeRow(entry.id)} disabled={entries.length === 1} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-right font-semibold text-gray-700">Grand Total:</td>
                  <td className="px-4 py-3 text-right font-bold text-lg text-teal-600">₹{totalAmount.toFixed(2)}</td>
                  <td colSpan="2" className="px-4 py-3 text-center">
                    <span className="text-xs font-semibold text-teal-600">
                      {entries.reduce((s, e) => s + (parseInt(e.strips || 0) * parseInt(e.unitsPerStrip || 10)), 0)} tablets
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button type="button" className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">Save Purchase Entry</button>
        </div>
      </form>
    </div>
  )
}
