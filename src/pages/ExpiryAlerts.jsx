import { useState, useEffect } from 'react'

const initialExpiryData = [
    { id: 1, name: 'Metformin 500mg', batch: 'BTH-2026-005', category: 'Tablet', expiry: '2026-03-15', stock: 12, supplier: 'MedSupply Co.', purchasePrice: 10, sellingPrice: 15 },
    { id: 2, name: 'Insulin Glargine', batch: 'BTH-2026-011', category: 'Injection', expiry: '2026-03-25', stock: 25, supplier: 'PharmaDist Ltd.', purchasePrice: 450, sellingPrice: 580 },
    { id: 3, name: 'Amoxicillin 250mg', batch: 'BTH-2026-002', category: 'Capsule', expiry: '2026-04-20', stock: 8, supplier: 'PharmaDist Ltd.', purchasePrice: 32, sellingPrice: 45 },
    { id: 4, name: 'Cough Syrup', batch: 'BTH-2026-015', category: 'Syrup', expiry: '2026-04-28', stock: 30, supplier: 'HealthCare Plus', purchasePrice: 55, sellingPrice: 75 },
    { id: 5, name: 'Ibuprofen 400mg', batch: 'BTH-2026-007', category: 'Tablet', expiry: '2026-05-05', stock: 5, supplier: 'HealthCare Plus', purchasePrice: 6, sellingPrice: 10 },
    { id: 6, name: 'Betadine Ointment', batch: 'BTH-2026-019', category: 'Ointment', expiry: '2026-05-12', stock: 18, supplier: 'MediWholesale', purchasePrice: 40, sellingPrice: 60 },
    { id: 7, name: 'Azithromycin 500mg', batch: 'BTH-2026-006', category: 'Tablet', expiry: '2026-05-18', stock: 75, supplier: 'PharmaDist Ltd.', purchasePrice: 60, sellingPrice: 85 },
    { id: 8, name: 'Pantoprazole 40mg', batch: 'BTH-2026-020', category: 'Tablet', expiry: '2026-06-10', stock: 120, supplier: 'MedSupply Co.', purchasePrice: 25, sellingPrice: 35 },
    { id: 9, name: 'Cetirizine Drops', batch: 'BTH-2026-022', category: 'Drops', expiry: '2026-06-25', stock: 40, supplier: 'HealthCare Plus', purchasePrice: 30, sellingPrice: 48 },
    { id: 10, name: 'Dolo 650mg', batch: 'BTH-2026-025', category: 'Tablet', expiry: '2026-07-30', stock: 200, supplier: 'MedSupply Co.', purchasePrice: 5, sellingPrice: 8 },
]

const filters = [
    { label: 'Critical (30 days)', days: 30, color: 'rose' },
    { label: 'Warning (60 days)', days: 60, color: 'amber' },
    { label: 'Upcoming (90 days)', days: 90, color: 'sky' },
    { label: 'All', days: 365, color: 'slate' },
]

function getDaysUntilExpiry(expiryDate) {
    const today = new Date()
    const expiry = new Date(expiryDate)
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
}

// Toast Component
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border animate-slide-in ${type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            type === 'info' ? 'bg-sky-50 border-sky-200 text-sky-800' :
                'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
            {type === 'success' && (
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            {type === 'info' && (
                <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

export default function ExpiryAlerts() {
    const [expiryData, setExpiryData] = useState(initialExpiryData)
    const [activeFilter, setActiveFilter] = useState(90)
    const [searchTerm, setSearchTerm] = useState('')
    const [stockAdjustmentsLog, setStockAdjustmentsLog] = useState([])

    // Modal state
    const [disposeModal, setDisposeModal] = useState({ open: false, medicine: null })
    const [returnModal, setReturnModal] = useState({ open: false, medicine: null })
    const [returnQty, setReturnQty] = useState('')
    const [returnReason, setReturnReason] = useState('')

    // Toast state
    const [toast, setToast] = useState(null)

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    // --- Dispose Logic ---
    const handleDisposeConfirm = () => {
        const med = disposeModal.medicine
        if (!med) return

        setExpiryData(prev => prev.map(m =>
            m.id === med.id ? { ...m, stock: 0 } : m
        ))

        // Log disposal
        const disposeEntry = {
            id: Date.now(),
            type: 'Dispose',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            medicineName: med.name,
            batch: med.batch,
            supplier: med.supplier,
            quantity: med.stock,
            reason: 'Expired / Near expiry — Disposed',
            valueLost: med.stock * med.purchasePrice,
        }
        setStockAdjustmentsLog(prev => [disposeEntry, ...prev])

        showToast(`${med.name} — Stock disposed successfully. Marked as Out of Stock.`, 'success')
        setDisposeModal({ open: false, medicine: null })
    }

    // --- Return Logic ---
    const handleReturnSubmit = (e) => {
        e.preventDefault()
        const med = returnModal.medicine
        const qty = parseInt(returnQty)

        if (!med || !qty || qty <= 0) return
        if (qty > med.stock) {
            showToast(`Cannot return more than current stock (${med.stock} units)`, 'error')
            return
        }

        // Update stock
        setExpiryData(prev => prev.map(m =>
            m.id === med.id ? { ...m, stock: m.stock - qty } : m
        ))

        // Log return
        const newEntry = {
            id: Date.now(),
            type: 'Return',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            medicineName: med.name,
            batch: med.batch,
            supplier: med.supplier,
            quantity: qty,
            reason: returnReason || 'Near expiry',
            valueLost: qty * med.purchasePrice,
        }
        setStockAdjustmentsLog(prev => [newEntry, ...prev])

        showToast(`Return recorded — ${qty} units of ${med.name} returned to ${med.supplier}`, 'info')
        setReturnModal({ open: false, medicine: null })
        setReturnQty('')
        setReturnReason('')
    }

    // Computed data
    const medicines = expiryData
        .map(m => ({ ...m, daysLeft: getDaysUntilExpiry(m.expiry) }))
        .filter(m => m.daysLeft <= activeFilter && m.daysLeft > 0)
        .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.batch.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.daysLeft - b.daysLeft)

    const criticalCount = expiryData.filter(m => getDaysUntilExpiry(m.expiry) <= 30 && getDaysUntilExpiry(m.expiry) > 0).length
    const warningCount = expiryData.filter(m => { const d = getDaysUntilExpiry(m.expiry); return d > 30 && d <= 60 }).length
    const upcomingCount = expiryData.filter(m => { const d = getDaysUntilExpiry(m.expiry); return d > 60 && d <= 90 }).length
    const totalAtRiskValue = medicines.reduce((sum, m) => sum + (m.stock * m.sellingPrice), 0)

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Dispose Confirmation Modal */}
            {disposeModal.open && (
                <div className="fixed inset-0 z-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDisposeModal({ open: false, medicine: null })}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-scale-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Dispose Expired Stock</h3>
                                <p className="text-xs text-slate-400">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-800">{disposeModal.medicine?.name}</span>
                                <span className="text-xs font-mono text-slate-400">{disposeModal.medicine?.batch}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                    <span className="text-slate-400">Stock</span>
                                    <p className="font-bold text-rose-600">{disposeModal.medicine?.stock} units</p>
                                </div>
                                <div>
                                    <span className="text-slate-400">Expiry</span>
                                    <p className="font-medium text-slate-700">{disposeModal.medicine?.expiry}</p>
                                </div>
                                <div>
                                    <span className="text-slate-400">Loss Value</span>
                                    <p className="font-bold text-rose-600">₹{((disposeModal.medicine?.stock || 0) * (disposeModal.medicine?.purchasePrice || 0)).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 mb-5">
                            Are you sure you want to dispose <strong>all {disposeModal.medicine?.stock} units</strong> of this medicine?
                            The stock will be set to <strong>0</strong> and marked as <strong>Out of Stock</strong>.
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDisposeModal({ open: false, medicine: null })}
                                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDisposeConfirm}
                                className="flex-1 px-4 py-2.5 bg-rose-500 text-white text-sm font-medium rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Dispose All Stock
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Modal */}
            {returnModal.open && (
                <div className="fixed inset-0 z-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setReturnModal({ open: false, medicine: null }); setReturnQty(''); setReturnReason('') }}></div>
                    <form onSubmit={handleReturnSubmit} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-scale-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Return to Supplier</h3>
                                <p className="text-xs text-slate-400">Record stock return to supplier</p>
                            </div>
                        </div>

                        <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-5">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-slate-800">{returnModal.medicine?.name}</span>
                                <span className="text-xs font-mono text-slate-400">{returnModal.medicine?.batch}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>Stock: <strong className="text-slate-700">{returnModal.medicine?.stock}</strong></span>
                                <span>Supplier: <strong className="text-slate-700">{returnModal.medicine?.supplier}</strong></span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Return Quantity *</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={returnModal.medicine?.stock}
                                    value={returnQty}
                                    onChange={(e) => setReturnQty(e.target.value)}
                                    placeholder={`Max: ${returnModal.medicine?.stock}`}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                                />
                                {returnQty && parseInt(returnQty) > 0 && (
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Return value: <strong className="text-slate-600">₹{(parseInt(returnQty) * (returnModal.medicine?.purchasePrice || 0)).toLocaleString()}</strong>
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason <span className="text-slate-400 font-normal">(optional)</span></label>
                                <textarea
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    placeholder="e.g. Near expiry, Damaged packaging..."
                                    rows={2}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => { setReturnModal({ open: false, medicine: null }); setReturnQty(''); setReturnReason('') }}
                                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-xl hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Record Return
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">Expiry Alerts</h1>
                <p className="text-slate-500 text-sm mt-0.5">Monitor medicines nearing expiry to prevent losses</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-rose-200/60 bg-rose-50/30">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-rose-600 uppercase">Critical</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{criticalCount}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Within 30 days</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-amber-200/60 bg-amber-50/30">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs font-medium text-amber-600 uppercase">Warning</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{warningCount}</p>
                    <p className="text-xs text-slate-400 mt-0.5">30–60 days</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-sky-200/60 bg-sky-50/30">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        <span className="text-xs font-medium text-sky-600 uppercase">Upcoming</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{upcomingCount}</p>
                    <p className="text-xs text-slate-400 mt-0.5">60–90 days</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200/60">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-500 uppercase">At-Risk Value</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">₹{totalAtRiskValue.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{medicines.length} items</p>
                </div>
            </div>

            {/* Filters + Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                    {filters.map(f => (
                        <button
                            key={f.days}
                            onClick={() => setActiveFilter(f.days)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeFilter === f.days
                                ? f.color === 'rose' ? 'bg-rose-500 text-white shadow-sm'
                                    : f.color === 'amber' ? 'bg-amber-500 text-white shadow-sm'
                                        : f.color === 'sky' ? 'bg-sky-500 text-white shadow-sm'
                                            : 'bg-slate-700 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
            </div>

            {/* Medicine Cards */}
            {medicines.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/60 px-6 py-16 text-center">
                    <svg className="w-12 h-12 text-emerald-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-400 text-sm">No medicines expiring in this period 🎉</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicines.map(med => (
                        <div key={med.id} className={`bg-white rounded-xl border p-5 transition-all hover:shadow-md ${med.daysLeft <= 30 ? 'border-rose-200 bg-rose-50/20' :
                            med.daysLeft <= 60 ? 'border-amber-200 bg-amber-50/20' :
                                'border-slate-200/60'
                            }`}>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-slate-800">{med.name}</h3>
                                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded">{med.category}</span>
                                        {med.stock === 0 && (
                                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded animate-pulse">OUT OF STOCK</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">{med.batch}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${med.daysLeft <= 30 ? 'bg-rose-100 text-rose-700' :
                                    med.daysLeft <= 60 ? 'bg-amber-100 text-amber-700' :
                                        'bg-sky-100 text-sky-700'
                                    }`}>
                                    {med.daysLeft} days
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Expiry</p>
                                    <p className="text-xs font-medium text-slate-700">{med.expiry}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Stock</p>
                                    <p className={`text-xs font-medium ${med.stock === 0 ? 'text-rose-500' : 'text-slate-700'}`}>{med.stock} units</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Value at Risk</p>
                                    <p className="text-xs font-semibold text-slate-800">₹{(med.stock * med.sellingPrice).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">Supplier: <span className="text-slate-600">{med.supplier}</span></span>
                                {med.stock > 0 ? (
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => setReturnModal({ open: true, medicine: med })}
                                            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg font-medium transition-colors flex items-center gap-1"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                            Return
                                        </button>
                                        <button
                                            onClick={() => setDisposeModal({ open: true, medicine: med })}
                                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-medium transition-colors flex items-center gap-1"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Dispose
                                        </button>
                                    </div>
                                ) : (
                                    <span className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg font-medium cursor-not-allowed">
                                        Disposed ✓
                                    </span>
                                )}
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full transition-all ${med.daysLeft <= 30 ? 'bg-rose-400' :
                                    med.daysLeft <= 60 ? 'bg-amber-400' :
                                        'bg-sky-400'
                                    }`} style={{ width: `${Math.max(5, 100 - med.daysLeft)}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stock Adjustments Log */}
            {stockAdjustmentsLog.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4.5 h-4.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">Stock Adjustments Log</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Audit trail of all returns & disposals</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                                {stockAdjustmentsLog.filter(e => e.type === 'Return').length} Returns
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                {stockAdjustmentsLog.filter(e => e.type === 'Dispose').length} Disposals
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date & Time</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Medicine</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Batch</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Supplier</th>
                                    <th className="px-5 py-3 text-center text-xs font-medium text-slate-500 uppercase">Qty</th>
                                    <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 uppercase">Loss Value</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stockAdjustmentsLog.map(entry => (
                                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3">
                                            <p className="text-sm text-slate-700">{entry.date}</p>
                                            <p className="text-[10px] text-slate-400">{entry.time}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${entry.type === 'Return' ? 'bg-sky-50 text-sky-700' : 'bg-rose-50 text-rose-700'
                                                }`}>
                                                {entry.type === 'Return' ? '↩' : '🗑'} {entry.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-sm font-medium text-slate-800">{entry.medicineName}</td>
                                        <td className="px-5 py-3 text-xs font-mono text-slate-500">{entry.batch}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{entry.supplier}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`text-sm font-bold ${entry.type === 'Return' ? 'text-sky-600' : 'text-rose-600'}`}>-{entry.quantity}</span>
                                        </td>
                                        <td className="px-5 py-3 text-right text-sm font-medium text-rose-600">₹{entry.valueLost.toLocaleString()}</td>
                                        <td className="px-5 py-3 text-sm text-slate-500 max-w-[200px] truncate">{entry.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-slate-200 bg-slate-50/50">
                                    <td colSpan={5} className="px-5 py-3 text-sm font-semibold text-slate-700">Total Loss</td>
                                    <td className="px-5 py-3 text-center text-sm font-bold text-slate-700">
                                        -{stockAdjustmentsLog.reduce((sum, e) => sum + e.quantity, 0)} units
                                    </td>
                                    <td className="px-5 py-3 text-right text-sm font-bold text-rose-600">
                                        ₹{stockAdjustmentsLog.reduce((sum, e) => sum + e.valueLost, 0).toLocaleString()}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
