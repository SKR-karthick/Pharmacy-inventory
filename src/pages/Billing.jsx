import { useState, useRef, useEffect } from 'react'
import { useMedicines } from '../context/MedicinesContext'

// --- Helper Functions ---
function findMedicine(medicines, query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return medicines.filter(m =>
    m.name.toLowerCase().includes(q) ||
    (m.barcode && m.barcode.includes(q))
  )
}

function findByBarcode(medicines, barcode) {
  return medicines.find(m => m.barcode === barcode) || null
}

// --- Toast Component ---
function BillingToast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500)
    return () => clearTimeout(t)
  }, [onClose])

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  }
  const icons = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  }

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border animate-slide-in ${styles[type] || styles.success}`}>
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[type] || icons.success} />
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

export default function Billing() {
  const { medicines, deductStock } = useMedicines()
  const medicinesList = medicines.map(m => ({ id: m.id, name: m.name, barcode: m.barcode, price: m.sellingPricePerUnit || m.sellingPrice, stock: m.totalStockUnits || m.quantity, category: m.category, sellingUnit: m.sellingUnit || 'Tablet', unitsPerPack: m.unitsPerPack || 10, purchasePrice: m.purchasePrice }))

  // POS search state
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)

  // Cart & customer state
  const [cartItems, setCartItems] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [sellAs, setSellAs] = useState('tablet') // 'tablet' | 'strip'
  const invoiceRef = useRef(null)

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [amountReceived, setAmountReceived] = useState('')
  const [invoiceStatus, setInvoiceStatus] = useState('pending') // pending | paid | unpaid | partial

  // Toast state
  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'success') => setToast({ message, type, key: Date.now() })

  // Auto-focus search on mount
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  // --- Search & Filter ---
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchInput(value)

    if (value.trim().length > 0) {
      const results = findMedicine(medicinesList, value)
      setSuggestions(results)
      setShowSuggestions(true)
      setHighlightIndex(results.length > 0 ? 0 : -1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setHighlightIndex(-1)
    }
  }

  // --- Add to Cart Logic ---
  const addToCart = (medicine) => {
    if (!medicine) return

    if (medicine.stock <= 0) {
      showToast(`${medicine.name} — Out of stock!`, 'error')
      clearAndRefocus()
      return
    }

    // Calculate units to add based on sell mode
    const unitsToAdd = sellAs === 'strip' ? (medicine.unitsPerPack || 10) : 1
    const pricePerQty = sellAs === 'strip' ? medicine.price * (medicine.unitsPerPack || 10) : medicine.price

    const existingItem = cartItems.find(item => item.id === medicine.id)
    const currentUnitsInCart = existingItem ? existingItem.actualUnits : 0

    // Stock validation: check if we have enough tablets
    if (currentUnitsInCart + unitsToAdd > medicine.stock) {
      showToast(`${medicine.name} — Insufficient stock! Only ${medicine.stock} ${medicine.sellingUnit || 'Tablet'}s available`, 'error')
      clearAndRefocus()
      return
    }

    if (existingItem) {
      const newQty = existingItem.qty + 1
      const newActualUnits = existingItem.actualUnits + unitsToAdd
      setCartItems(cartItems.map(item =>
        item.id === medicine.id
          ? { ...item, qty: newQty, actualUnits: newActualUnits, total: newQty * item.pricePerQty }
          : item
      ))
      showToast(`${medicine.name} — Qty increased to ${newQty} ${existingItem.sellMode === 'strip' ? 'strip' : 'tablet'}s`, 'success')
    } else {
      setCartItems([...cartItems, {
        id: medicine.id,
        name: medicine.name,
        qty: 1,
        actualUnits: unitsToAdd, // always store actual tablets for deduction
        price: medicine.price,
        pricePerQty: pricePerQty,
        total: pricePerQty,
        sellingUnit: medicine.sellingUnit || 'Tablet',
        unitsPerPack: medicine.unitsPerPack || 10,
        purchasePrice: medicine.purchasePrice || 0,
        sellMode: sellAs,
      }])
      showToast(`${medicine.name} — Added (${sellAs === 'strip' ? `1 strip = ${unitsToAdd} tablets` : '1 tablet'}) ✓`, 'success')
    }

    clearAndRefocus()
  }

  const clearAndRefocus = () => {
    setSearchInput('')
    setSuggestions([])
    setShowSuggestions(false)
    setHighlightIndex(-1)
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  // --- Barcode Scan Handler ---
  const handleBarcodeScan = (input) => {
    const barcode = input.trim()
    const medicine = findByBarcode(medicinesList, barcode)

    if (medicine) {
      addToCart(medicine)
    } else {
      showToast(`Barcode "${barcode}" — Medicine not found`, 'error')
      clearAndRefocus()
    }
  }

  // --- Keyboard Navigation ---
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (suggestions.length > 0) {
        setHighlightIndex(prev => Math.min(prev + 1, suggestions.length - 1))
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (suggestions.length > 0) {
        setHighlightIndex(prev => Math.max(prev - 1, 0))
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const value = searchInput.trim()

      // Check if it looks like a barcode (long numeric string)
      if (/^\d{8,}$/.test(value)) {
        handleBarcodeScan(value)
        return
      }

      // If a suggestion is highlighted, add it
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        addToCart(suggestions[highlightIndex])
        return
      }

      // If exactly one match, auto-add
      if (suggestions.length === 1) {
        addToCart(suggestions[0])
        return
      }

      // If input matches a barcode exactly
      if (value.length > 0) {
        const barcodeMatch = findByBarcode(medicinesList, value)
        if (barcodeMatch) {
          addToCart(barcodeMatch)
          return
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setHighlightIndex(-1)
    }
  }

  // --- Cart Operations ---
  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + change)
        const unitsPerQty = item.sellMode === 'strip' ? (item.unitsPerPack || 10) : 1
        return { ...item, qty: newQty, actualUnits: newQty * unitsPerQty, total: newQty * item.pricePerQty }
      }
      return item
    }))
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0)
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + gst
  const cashReceived = parseFloat(amountReceived) || 0
  const changeAmount = cashReceived - total
  const isCashInsufficient = paymentMethod === 'cash' && cashReceived > 0 && cashReceived < total
  const isCashEmpty = paymentMethod === 'cash' && amountReceived === ''
  const canSave = cartItems.length > 0 && !(paymentMethod === 'cash' && (isCashInsufficient || isCashEmpty))

  // --- Print ---
  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - Chitra Multi Speciality Clinic</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #1e293b; font-size: 13px; }
          .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 15px; }
          .header h1 { font-size: 22px; color: #059669; font-weight: 700; }
          .header h2 { font-size: 14px; color: #475569; font-weight: 500; margin-top: 2px; }
          .header p { font-size: 11px; color: #64748b; margin-top: 4px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 15px; }
          .info-block p { margin-bottom: 3px; }
          .info-block .label { color: #64748b; font-size: 11px; }
          .info-block .value { font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f1f5f9; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
          td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .totals { margin-left: auto; width: 250px; }
          .totals .row { display: flex; justify-content: space-between; padding: 5px 0; }
          .totals .total-row { border-top: 2px solid #059669; font-size: 16px; font-weight: 700; padding-top: 8px; margin-top: 5px; color: #059669; }
          .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; }
          .footer p { font-size: 11px; color: #94a3b8; }
          .license { font-size: 10px; color: #94a3b8; margin-top: 8px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Chitra Multi Speciality Clinic</h1>
          <h2>Pharmacy Division</h2>
          <p>Natarajan Street, Muthamizh Nagar, Pammal, Chennai - 600075, Tamil Nadu</p>
          <p>Phone: 9994914306 | Mobile: 9994714303</p>
        </div>

        <div class="info-row">
          <div class="info-block">
            <p class="label">Customer</p>
            <p class="value">${customerName || 'Walk-in Customer'}</p>
            ${customerPhone ? `<p>${customerPhone}</p>` : ''}
            ${doctorName ? `<p class="label" style="margin-top:5px">Prescribed by</p><p class="value">${doctorName}</p>` : ''}
          </div>
          <div class="info-block" style="text-align:right">
            <p class="label">Invoice No</p>
            <p class="value">CMC-INV-${Date.now().toString().slice(-6)}</p>
            <p class="label" style="margin-top:5px">Date</p>
            <p class="value">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems.map((item, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${item.name}</td>
                <td class="text-center">${item.qty}</td>
                <td class="text-right">₹${item.price}</td>
                <td class="text-right">₹${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="row"><span>Subtotal</span><span>₹${subtotal}</span></div>
          <div class="row"><span>GST (5%)</span><span>₹${gst}</span></div>
          <div class="row total-row"><span>Total</span><span>₹${total}</span></div>
        </div>

        <div class="footer">
          <p>Thank you for choosing Chitra Multi Speciality Clinic. Get well soon!</p>
          <p class="license">GST: 33AABCU9603R1ZM | Drug License: TN/21/20/1234</p>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 250)
  }

  const handleGenerateInvoice = () => {
    if (cartItems.length === 0) {
      showToast('Please add items to cart first', 'warning')
      return
    }
    handlePrint()
  }

  const handleSaveInvoice = () => {
    if (!canSave) return

    // Deduct stock in tablets for each cart item
    cartItems.forEach(item => {
      deductStock(item.id, item.actualUnits)
    })

    // Set invoice status based on payment method
    if (paymentMethod === 'credit') {
      setInvoiceStatus('unpaid')
    } else {
      setInvoiceStatus('paid')
    }

    showToast('Invoice saved successfully ✓', 'success')

    // Reset after short delay so user sees the toast
    setTimeout(() => {
      setCartItems([])
      setCustomerName('')
      setCustomerPhone('')
      setDoctorName('')
      setPaymentMethod('cash')
      setAmountReceived('')
      setInvoiceStatus('pending')
      clearAndRefocus()
    }, 800)
  }

  const handleNewInvoice = () => {
    setCartItems([])
    setCustomerName('')
    setCustomerPhone('')
    setDoctorName('')
    setPaymentMethod('cash')
    setAmountReceived('')
    setInvoiceStatus('pending')
    setSellAs('tablet')
    clearAndRefocus()
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && <BillingToast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Billing</h1>
        <p className="mt-0.5 text-sm text-slate-500">Create new invoice and process sales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - POS Search & Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* POS Search Input */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/60">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800">Add Medicine</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Barcode Ready
              </div>
            </div>

            <div className="relative">
              <div className="relative">
                <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { if (searchInput.trim()) setShowSuggestions(true) }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Scan barcode or type medicine name..."
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all"
                />
                {searchInput && (
                  <button
                    onClick={clearAndRefocus}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 z-30 max-h-[280px] overflow-y-auto">
                  {suggestions.map((med, index) => (
                    <button
                      key={med.id}
                      onMouseDown={(e) => { e.preventDefault(); addToCart(med) }}
                      onMouseEnter={() => setHighlightIndex(index)}
                      className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${index === highlightIndex ? 'bg-emerald-50' : 'hover:bg-slate-50'
                        } ${index === 0 ? 'rounded-t-xl' : ''} ${index === suggestions.length - 1 ? 'rounded-b-xl' : 'border-b border-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${index === highlightIndex ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                          {med.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${index === highlightIndex ? 'text-emerald-800' : 'text-slate-800'}`}>{med.name}</p>
                          <p className="text-[11px] text-slate-400">{med.category} • {med.barcode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">₹{med.price}/{med.sellingUnit || 'Tab'}</p>
                        <p className={`text-[11px] font-medium ${med.stock <= 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {med.stock} {med.sellingUnit || 'Tablet'}s
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {showSuggestions && searchInput.trim() && suggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 z-30 px-4 py-6 text-center">
                  <svg className="w-8 h-8 text-slate-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-slate-400">No medicine found for "{searchInput}"</p>
                  <p className="text-xs text-slate-300 mt-0.5">Try a different name or scan barcode</p>
                </div>
              )}
            </div>

            {/* Shortcut hints */}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono font-medium text-slate-500">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono font-medium text-slate-500">Enter</kbd> Add to cart
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono font-medium text-slate-500">Esc</kbd> Close
              </span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">Cart Items</h2>
              <div className="flex items-center gap-3">
                {/* Sell As Toggle */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Sell as:</span>
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setSellAs('tablet')}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${sellAs === 'tablet' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                    >
                      Tablet
                    </button>
                    <button
                      onClick={() => setSellAs('strip')}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${sellAs === 'strip' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                    >
                      Strip
                    </button>
                  </div>
                </div>
                <span className="text-sm text-slate-400">{cartItems.length} items</span>
              </div>
            </div>
            {cartItems.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="w-12 h-12 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-slate-400 text-sm">No items in cart</p>
                <p className="text-xs text-slate-300 mt-1">Scan a barcode or search for a medicine to begin</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Medicine</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {item.sellMode === 'strip' ? `${item.qty} strip × ${item.unitsPerPack} = ${item.actualUnits} tablets` : `${item.qty} ${item.sellingUnit || 'tablet'}s`}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-slate-600 text-sm">−</span>
                          </button>
                          <span className="w-8 text-center font-medium text-sm">{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-slate-600 text-sm">+</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 text-sm">₹{item.pricePerQty}{item.sellMode === 'strip' ? '/strip' : `/${item.sellingUnit || 'tab'}`}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800 text-sm">₹{item.total}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column - Invoice Preview */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/60">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Customer Details</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Doctor Name (e.g. Dr. Senthil)"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/60">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Payment Details</h2>

            {/* Payment Method Radio Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { id: 'cash', label: 'Cash', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
                { id: 'upi', label: 'UPI', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                { id: 'card', label: 'Card', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                { id: 'credit', label: 'Credit', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => { setPaymentMethod(method.id); setAmountReceived('') }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${paymentMethod === method.id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={method.icon} />
                  </svg>
                  {method.label}
                </button>
              ))}
            </div>

            {/* Cash: Amount Received + Change */}
            {paymentMethod === 'cash' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">Amount Received</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                    <input
                      type="number"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                {amountReceived !== '' && (
                  <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg ${changeAmount >= 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'
                    }`}>
                    <span className={`text-xs font-medium ${changeAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {changeAmount >= 0 ? 'Change to return' : 'Insufficient amount'}
                    </span>
                    <span className={`text-sm font-bold ${changeAmount >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      ₹{Math.abs(changeAmount)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* UPI / Card: Success Message */}
            {(paymentMethod === 'upi' || paymentMethod === 'card') && (
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-emerald-700">Payment Marked as Successful</p>
                  <p className="text-[11px] text-emerald-500">Demo mode — no gateway required</p>
                </div>
              </div>
            )}

            {/* Credit: Pending Note */}
            {paymentMethod === 'credit' && (
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-700">Payment Pending</p>
                  <p className="text-[11px] text-amber-500">Invoice will be marked as UNPAID</p>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Preview Card */}
          <div ref={invoiceRef} className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Chitra Multi Speciality Clinic</h2>
                  <p className="text-emerald-100 text-xs mt-0.5">Pharmacy Division</p>
                </div>
                {/* Invoice Status Badge */}
                {invoiceStatus !== 'pending' && (
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${invoiceStatus === 'paid' ? 'bg-emerald-500 text-white' :
                    invoiceStatus === 'unpaid' ? 'bg-rose-500 text-white' :
                      'bg-amber-500 text-white'
                    }`}>
                    {invoiceStatus}
                  </span>
                )}
              </div>
              <p className="text-emerald-200/70 text-[11px] mt-1">Natarajan St, Pammal, Chennai - 600075</p>
            </div>
            <div className="px-5 pt-4">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Invoice</p>
                  <p className="text-xs font-semibold text-slate-700">CMC-INV-{Date.now().toString().slice(-6)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase">Date</p>
                  <p className="text-xs font-semibold text-slate-700">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="mb-3 pb-3 border-b border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase">Customer</p>
                <p className="text-sm font-medium text-slate-800">{customerName || 'Walk-in Customer'}</p>
                {customerPhone && <p className="text-xs text-slate-500">{customerPhone}</p>}
                {doctorName && (
                  <p className="text-xs text-slate-400 mt-1">Rx: <span className="text-slate-600 font-medium">{doctorName}</span></p>
                )}
              </div>

              <div className="space-y-1.5 mb-3 pb-3 border-b border-slate-100">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-slate-300 italic py-2">No items added</p>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="text-slate-600">{item.name} ×{item.qty}</span>
                      <span className="text-slate-800 font-medium">₹{item.total}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-medium text-slate-700">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">GST (5%)</span>
                  <span className="font-medium text-slate-700">₹{gst}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-semibold text-slate-800">Total</span>
                  <span className="text-lg font-bold text-emerald-600">₹{total}</span>
                </div>
                {/* Payment method display */}
                <div className="flex justify-between pt-1.5">
                  <span className="text-[11px] text-slate-400">Payment</span>
                  <span className="text-xs font-medium text-slate-600 capitalize">{paymentMethod}{paymentMethod === 'credit' ? ' (Unpaid)' : ''}</span>
                </div>
                {paymentMethod === 'cash' && cashReceived > 0 && changeAmount >= 0 && (
                  <div className="flex justify-between pt-1">
                    <span className="text-[11px] text-slate-400">Change</span>
                    <span className="text-xs font-medium text-emerald-600">₹{changeAmount}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pb-4">
                <button
                  onClick={handleSaveInvoice}
                  disabled={!canSave}
                  className="flex-1 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Invoice
                </button>
                <button
                  onClick={handleGenerateInvoice}
                  disabled={cartItems.length === 0}
                  className="px-3 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button
                  onClick={handleNewInvoice}
                  className="px-3 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  New
                </button>
              </div>
            </div>

            {/* Invoice Footer */}
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 text-center">GST: 33AABCU9603R1ZM | D.L: TN/21/20/1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
