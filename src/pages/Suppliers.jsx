import { useState } from 'react'

const initialSuppliers = [
    { id: 1, name: 'MedSupply Co.', contact: 'Ravi Kumar', phone: '9876543210', email: 'ravi@medsupply.in', address: '45, Anna Nagar, Chennai - 600040', gstNo: '33AABCM1234R1ZP', status: 'active' },
    { id: 2, name: 'PharmaDist Ltd.', contact: 'Suresh Babu', phone: '9876512345', email: 'suresh@pharmadist.in', address: '12, MG Road, Coimbatore - 641001', gstNo: '33AABCP5678R1ZQ', status: 'active' },
    { id: 3, name: 'HealthCare Plus', contact: 'Priya Mohan', phone: '9871234567', email: 'priya@healthcareplus.in', address: '78, Nehru St, Madurai - 625001', gstNo: '33AABCH9012R1ZR', status: 'active' },
    { id: 4, name: 'MediWholesale', contact: 'Anand Raj', phone: '9865432109', email: 'anand@mediwholesale.in', address: '23, KK Nagar, Trichy - 620001', gstNo: '33AABCW3456R1ZS', status: 'active' },
]

const emptyForm = { name: '', contact: '', phone: '', email: '', address: '', gstNo: '' }

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState(initialSuppliers)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState(emptyForm)
    const [searchTerm, setSearchTerm] = useState('')

    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.gstNo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editingId) {
            setSuppliers(suppliers.map(s => s.id === editingId ? { ...formData, id: editingId, status: 'active' } : s))
            setEditingId(null)
        } else {
            setSuppliers([...suppliers, { ...formData, id: Date.now(), status: 'active' }])
        }
        setFormData(emptyForm)
        setShowForm(false)
    }

    const handleEdit = (supplier) => {
        setFormData({ name: supplier.name, contact: supplier.contact, phone: supplier.phone, email: supplier.email, address: supplier.address, gstNo: supplier.gstNo })
        setEditingId(supplier.id)
        setShowForm(true)
    }

    const handleDelete = (id) => {
        if (window.confirm('Delete this supplier?')) {
            setSuppliers(suppliers.filter(s => s.id !== id))
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingId(null)
        setFormData(emptyForm)
    }

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">Suppliers</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage your medicine suppliers</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm) }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Supplier
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/60 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., MedSupply Co."
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Person *</label>
                            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required placeholder="e.g., Ravi Kumar"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="9876543210"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@company.com"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">GST Number *</label>
                            <input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} required placeholder="33AABCX1234R1ZP"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address *</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Full address"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        </div>
                    </div>
                    <div className="mt-5 flex items-center justify-end gap-3">
                        <button type="button" onClick={handleCancel} className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                            {editingId ? 'Update Supplier' : 'Add Supplier'}
                        </button>
                    </div>
                </form>
            )}

            {/* Search */}
            <div className="flex items-center justify-between gap-3">
                <div className="relative w-72">
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search suppliers..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <span className="text-sm text-slate-500">{suppliers.length} suppliers</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">GST No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Address</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <p className="text-sm font-medium text-slate-800">{supplier.name}</p>
                                        {supplier.email && <p className="text-xs text-slate-400">{supplier.email}</p>}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-slate-600">{supplier.contact}</td>
                                    <td className="px-4 py-3.5 text-sm text-slate-600">{supplier.phone}</td>
                                    <td className="px-4 py-3.5 text-xs font-mono text-slate-500">{supplier.gstNo}</td>
                                    <td className="px-4 py-3.5 text-sm text-slate-500 max-w-[200px] truncate">{supplier.address}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleEdit(supplier)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Edit">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDelete(supplier.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-slate-400 text-sm">No suppliers found</p>
                    </div>
                )}
            </div>
        </div>
    )
}
