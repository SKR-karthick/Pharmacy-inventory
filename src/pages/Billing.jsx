import { useState, useRef } from 'react'
import { useMedicines } from '../context/MedicinesContext'

export default function Billing() {
  const { medicines } = useMedicines()
  const medicinesList = medicines.map(m => ({ id: m.id, name: m.name, price: m.sellingPrice, stock: m.quantity }))
  const [selectedMedicine, setSelectedMedicine] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [cartItems, setCartItems] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const invoiceRef = useRef(null)

  const handleAddToCart = () => {
    if (!selectedMedicine) return

    const medicine = medicinesList.find(m => m.id === parseInt(selectedMedicine))
    if (!medicine) return

    const existingItem = cartItems.find(item => item.id === medicine.id)

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === medicine.id
          ? { ...item, qty: item.qty + quantity, total: (item.qty + quantity) * item.price }
          : item
      ))
    } else {
      setCartItems([...cartItems, {
        id: medicine.id,
        name: medicine.name,
        qty: quantity,
        price: medicine.price,
        total: quantity * medicine.price
      }])
    }

    setSelectedMedicine('')
    setQuantity(1)
  }

  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + change)
        return { ...item, qty: newQty, total: newQty * item.price }
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
          .info-block { }
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
      alert('Please add items to cart')
      return
    }
    handlePrint()
  }

  const handleNewInvoice = () => {
    setCartItems([])
    setCustomerName('')
    setCustomerPhone('')
    setDoctorName('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Billing</h1>
        <p className="mt-0.5 text-sm text-slate-500">Create new invoice and process sales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Add Medicine & Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Medicine Section */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/60">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Add Medicine</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-600 mb-2">Select Medicine</label>
                <select
                  value={selectedMedicine}
                  onChange={(e) => setSelectedMedicine(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all"
                >
                  <option value="">Choose medicine...</option>
                  {medicinesList.map(med => (
                    <option key={med.id} value={med.id}>
                      {med.name} - ₹{med.price} (Stock: {med.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-28">
                <label className="block text-sm font-medium text-slate-600 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedMedicine}
                  className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">Cart Items</h2>
              <span className="text-sm text-slate-400">{cartItems.length} items</span>
            </div>
            {cartItems.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="w-12 h-12 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-slate-400 text-sm">No items in cart</p>
                <p className="text-xs text-slate-300 mt-1">Select a medicine and add to cart</p>
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
                      <td className="px-6 py-4 font-medium text-slate-800 text-sm">{item.name}</td>
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
                      <td className="px-6 py-4 text-right text-slate-500 text-sm">₹{item.price}</td>
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

          {/* Invoice Preview Card */}
          <div ref={invoiceRef} className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
              <h2 className="text-base font-bold text-white">Chitra Multi Speciality Clinic</h2>
              <p className="text-emerald-100 text-xs mt-0.5">Pharmacy Division</p>
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
              </div>

              <div className="flex gap-2 pb-4">
                <button
                  onClick={handleGenerateInvoice}
                  disabled={cartItems.length === 0}
                  className="flex-1 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={() => {
                    if (cartItems.length === 0) { alert('Please add items to cart'); return }
                    handlePrint()
                  }}
                  disabled={cartItems.length === 0}
                  className="flex-1 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF
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
