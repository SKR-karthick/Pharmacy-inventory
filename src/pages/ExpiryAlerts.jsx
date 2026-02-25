import { useState } from 'react'

const expiryData = [
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

export default function ExpiryAlerts() {
    const [activeFilter, setActiveFilter] = useState(90)
    const [searchTerm, setSearchTerm] = useState('')

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
                                    <p className="text-xs font-medium text-slate-700">{med.stock} units</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Value at Risk</p>
                                    <p className="text-xs font-semibold text-slate-800">₹{(med.stock * med.sellingPrice).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">Supplier: <span className="text-slate-600">{med.supplier}</span></span>
                                <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium transition-colors">
                                    Return / Dispose
                                </button>
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
        </div>
    )
}
