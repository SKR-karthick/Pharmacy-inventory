import { useParams, Link } from 'react-router-dom'

const medicinesDB = {
    1: { name: 'Paracetamol 500mg', batchNo: 'BTH-2026-001', category: 'Tablet', expiry: '2027-03-15', quantity: 245, purchasePrice: 8, sellingPrice: 12, supplier: 'MedSupply Co.', location: 'Rack A-3', minStock: 50 },
    2: { name: 'Amoxicillin 250mg', batchNo: 'BTH-2026-002', category: 'Capsule', expiry: '2026-08-20', quantity: 8, purchasePrice: 32, sellingPrice: 45, supplier: 'PharmaDist Ltd.', location: 'Rack B-1', minStock: 30 },
    3: { name: 'Omeprazole 20mg', batchNo: 'BTH-2026-003', category: 'Capsule', expiry: '2026-12-10', quantity: 156, purchasePrice: 18, sellingPrice: 28, supplier: 'HealthCare Plus', location: 'Rack A-5', minStock: 40 },
    4: { name: 'Cetirizine 10mg', batchNo: 'BTH-2026-004', category: 'Tablet', expiry: '2027-05-25', quantity: 320, purchasePrice: 5, sellingPrice: 8, supplier: 'MediWholesale', location: 'Rack C-2', minStock: 60 },
    5: { name: 'Metformin 500mg', batchNo: 'BTH-2026-005', category: 'Tablet', expiry: '2026-06-30', quantity: 12, purchasePrice: 10, sellingPrice: 15, supplier: 'MedSupply Co.', location: 'Rack B-4', minStock: 50 },
    6: { name: 'Azithromycin 500mg', batchNo: 'BTH-2026-006', category: 'Tablet', expiry: '2026-09-18', quantity: 75, purchasePrice: 60, sellingPrice: 85, supplier: 'PharmaDist Ltd.', location: 'Rack A-1', minStock: 20 },
    7: { name: 'Ibuprofen 400mg', batchNo: 'BTH-2026-007', category: 'Tablet', expiry: '2027-01-22', quantity: 5, purchasePrice: 6, sellingPrice: 10, supplier: 'HealthCare Plus', location: 'Rack C-5', minStock: 40 },
}

const stockHistory = {
    1: [
        { id: 1, date: '2026-02-25', type: 'sale', ref: 'INV-001', qty: -10, balance: 245, note: 'Walk-in Customer' },
        { id: 2, date: '2026-02-24', type: 'sale', ref: 'INV-098', qty: -5, balance: 255, note: 'Rajesh Kumar' },
        { id: 3, date: '2026-02-22', type: 'purchase', ref: 'PO-045', qty: +100, balance: 260, note: 'MedSupply Co.' },
        { id: 4, date: '2026-02-20', type: 'sale', ref: 'INV-092', qty: -15, balance: 160, note: 'Priya Sharma' },
        { id: 5, date: '2026-02-18', type: 'sale', ref: 'INV-088', qty: -8, balance: 175, note: 'Walk-in Customer' },
        { id: 6, date: '2026-02-15', type: 'adjustment', ref: 'ADJ-003', qty: -2, balance: 183, note: 'Damaged stock removed' },
        { id: 7, date: '2026-02-10', type: 'purchase', ref: 'PO-038', qty: +50, balance: 185, note: 'MedSupply Co.' },
        { id: 8, date: '2026-02-05', type: 'sale', ref: 'INV-075', qty: -20, balance: 135, note: 'Meena Kumari' },
        { id: 9, date: '2026-01-30', type: 'sale', ref: 'INV-068', qty: -12, balance: 155, note: 'Walk-in Customer' },
        { id: 10, date: '2026-01-25', type: 'purchase', ref: 'PO-030', qty: +100, balance: 167, note: 'MedSupply Co.' },
    ],
    2: [
        { id: 1, date: '2026-02-24', type: 'sale', ref: 'INV-097', qty: -5, balance: 8, note: 'Anand Raj' },
        { id: 2, date: '2026-02-20', type: 'sale', ref: 'INV-090', qty: -7, balance: 13, note: 'Walk-in Customer' },
        { id: 3, date: '2026-02-15', type: 'purchase', ref: 'PO-042', qty: +20, balance: 20, note: 'PharmaDist Ltd.' },
    ],
    3: [
        { id: 1, date: '2026-02-23', type: 'sale', ref: 'INV-095', qty: -4, balance: 156, note: 'Lakshmi Devi' },
        { id: 2, date: '2026-02-18', type: 'purchase', ref: 'PO-040', qty: +60, balance: 160, note: 'HealthCare Plus' },
        { id: 3, date: '2026-02-10', type: 'sale', ref: 'INV-082', qty: -10, balance: 100, note: 'Walk-in Customer' },
    ],
}

// Generate default history for medicines without specific history
function getHistory(id) {
    if (stockHistory[id]) return stockHistory[id]
    return [
        { id: 1, date: '2026-02-20', type: 'purchase', ref: 'PO-041', qty: +50, balance: medicinesDB[id]?.quantity || 0, note: 'Initial purchase' },
        { id: 2, date: '2026-02-15', type: 'sale', ref: 'INV-085', qty: -5, balance: (medicinesDB[id]?.quantity || 0) - 50, note: 'Walk-in Customer' },
    ]
}

export default function MedicineDetails() {
    const { id } = useParams()
    const medicine = medicinesDB[id]
    const history = getHistory(parseInt(id))

    if (!medicine) {
        return (
            <div className="space-y-6 max-w-4xl">
                <Link to="/medicines" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Medicines
                </Link>
                <div className="bg-white rounded-xl border border-slate-200/60 px-6 py-16 text-center">
                    <p className="text-slate-400">Medicine not found</p>
                </div>
            </div>
        )
    }

    const isLowStock = medicine.quantity <= medicine.minStock
    const margin = ((medicine.sellingPrice - medicine.purchasePrice) / medicine.purchasePrice * 100).toFixed(1)
    const stockValue = medicine.quantity * medicine.sellingPrice

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Back + Header */}
            <div className="flex items-center gap-4">
                <Link to="/medicines" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold text-slate-800">{medicine.name}</h1>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-md">{medicine.category}</span>
                        {isLowStock && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-md animate-pulse">LOW STOCK</span>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm mt-0.5">Batch: {medicine.batchNo} · Supplier: {medicine.supplier}</p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200/60">
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Current Stock</p>
                    <p className={`text-xl font-bold ${isLowStock ? 'text-amber-600' : 'text-slate-800'}`}>{medicine.quantity}</p>
                    <p className="text-[10px] text-slate-400">Min: {medicine.minStock}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200/60">
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Purchase Price</p>
                    <p className="text-xl font-bold text-slate-800">₹{medicine.purchasePrice}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200/60">
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Selling Price</p>
                    <p className="text-xl font-bold text-slate-800">₹{medicine.sellingPrice}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200/60">
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Margin</p>
                    <p className="text-xl font-bold text-emerald-600">{margin}%</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200/60">
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Stock Value</p>
                    <p className="text-xl font-bold text-slate-800">₹{stockValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200/60 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Storage Info</h3>
                    <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Location</span>
                            <span className="font-medium text-slate-700">{medicine.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Expiry</span>
                            <span className="font-medium text-slate-700">{medicine.expiry}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Batch No</span>
                            <span className="font-mono text-xs text-slate-600">{medicine.batchNo}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/60 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Supplier Info</h3>
                    <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Supplier</span>
                            <span className="font-medium text-slate-700">{medicine.supplier}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Category</span>
                            <span className="font-medium text-slate-700">{medicine.category}</span>
                        </div>
                    </div>
                </div>

                <div className={`rounded-xl border p-5 ${isLowStock ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200/60 bg-white'}`}>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Stock Status</h3>
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-400">Level</span>
                        <span className={`font-semibold ${isLowStock ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {isLowStock ? 'Below Minimum' : 'Healthy'}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
                        <div className={`h-2.5 rounded-full transition-all ${isLowStock ? 'bg-amber-400' : 'bg-emerald-400'}`}
                            style={{ width: `${Math.min((medicine.quantity / (medicine.minStock * 3)) * 100, 100)}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 text-right">{medicine.quantity} / {medicine.minStock * 3} (max)</p>
                </div>
            </div>

            {/* Stock History */}
            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-slate-800">Stock History</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Audit trail of all stock movements</p>
                    </div>
                    <span className="text-xs text-slate-400">{history.length} entries</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reference</th>
                                <th className="px-5 py-3 text-center text-xs font-medium text-slate-500 uppercase">Qty Change</th>
                                <th className="px-5 py-3 text-center text-xs font-medium text-slate-500 uppercase">Balance</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.map(entry => (
                                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-3 text-sm text-slate-600">{entry.date}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${entry.type === 'purchase' ? 'bg-emerald-50 text-emerald-700' :
                                                entry.type === 'sale' ? 'bg-sky-50 text-sky-700' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {entry.type === 'purchase' && (
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                                            )}
                                            {entry.type === 'sale' && (
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                                            )}
                                            {entry.type === 'adjustment' && (
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            )}
                                            {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-xs font-mono text-slate-500">{entry.ref}</td>
                                    <td className="px-5 py-3 text-center">
                                        <span className={`text-sm font-bold ${entry.qty > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {entry.qty > 0 ? '+' : ''}{entry.qty}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-center font-medium text-slate-700">{entry.balance}</td>
                                    <td className="px-5 py-3 text-sm text-slate-500">{entry.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
