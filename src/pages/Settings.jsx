import { useState } from 'react'

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')

  const [profile, setProfile] = useState({
    name: 'Chitra Multi Speciality Clinic',
    pharmacyName: 'Chitra Multi Speciality Clinic - Pharmacy',
    address: 'Natarajan Street, Muthamizh Nagar, Pammal',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600075',
    phone: '9994914306',
    mobile: '9994714303',
    email: 'chitraclinic@gmail.com',
    gstNumber: '33AABCU9603R1ZM',
    drugLicense: 'TN/21/20/1234',
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: 'CMC-INV',
    footerText: 'Thank you for choosing Chitra Multi Speciality Clinic. Get well soon!',
    showGST: true,
    showDrugLicense: true,
    showDoctor: true,
  })

  const [notifications, setNotifications] = useState({
    lowStockThreshold: 20,
    expiryAlertDays: 90,
    enableLowStock: true,
    enableExpiry: true,
  })

  const [categories, setCategories] = useState([
    'Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Equipment', 'Surgical', 'Vitamins'
  ])
  const [newCategory, setNewCategory] = useState('')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const sections = [
    { key: 'profile', label: 'Pharmacy Profile', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { key: 'categories', label: 'Medicine Categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
    { key: 'invoice', label: 'Invoice Settings', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure your pharmacy settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Side Navigation */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-slate-200/60 overflow-hidden divide-y divide-slate-100">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${activeSection === section.key
                  ? 'bg-emerald-50 text-emerald-600 border-l-2 border-emerald-500'
                  : 'text-slate-600 hover:bg-slate-50 border-l-2 border-transparent'
                  }`}
              >
                <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={section.icon} />
                </svg>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Pharmacy Profile */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Pharmacy Profile</h2>
              <p className="text-sm text-slate-400 mb-6">Basic information about your pharmacy</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Clinic / Hospital Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pharmacy Name</label>
                  <input
                    type="text"
                    value={profile.pharmacyName}
                    onChange={(e) => setProfile({ ...profile, pharmacyName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pincode</label>
                  <input
                    type="text"
                    value={profile.pincode}
                    onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile</label>
                  <input
                    type="tel"
                    value={profile.mobile}
                    onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">GST Number</label>
                  <input
                    type="text"
                    value={profile.gstNumber}
                    onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Drug License Number</label>
                  <input
                    type="text"
                    value={profile.drugLicense}
                    onChange={(e) => setProfile({ ...profile, drugLicense: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Invoice Settings */}
          {activeSection === 'invoice' && (
            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Invoice Settings</h2>
              <p className="text-sm text-slate-400 mb-6">Customize how your invoices appear</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Invoice Prefix</label>
                  <input
                    type="text"
                    value={invoiceSettings.prefix}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, prefix: e.target.value })}
                    className="w-64 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  <p className="text-xs text-slate-400 mt-1.5">Invoice numbers will start with this prefix, e.g. CMC-INV-001</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Invoice Footer Text</label>
                  <textarea
                    value={invoiceSettings.footerText}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, footerText: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Display Options</h3>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Show GST Number</p>
                      <p className="text-xs text-slate-400">Display GST number on invoices</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={invoiceSettings.showGST}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, showGST: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 peer-checked:bg-emerald-500 rounded-full transition-colors cursor-pointer"></div>
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Show Drug License</p>
                      <p className="text-xs text-slate-400">Display drug license number on invoices</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={invoiceSettings.showDrugLicense}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, showDrugLicense: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 peer-checked:bg-emerald-500 rounded-full transition-colors cursor-pointer"></div>
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Show Doctor Name</p>
                      <p className="text-xs text-slate-400">Include prescribing doctor on invoices</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={invoiceSettings.showDoctor}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, showDoctor: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 peer-checked:bg-emerald-500 rounded-full transition-colors cursor-pointer"></div>
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Notification Preferences</h2>
              <p className="text-sm text-slate-400 mb-6">Configure alerts and thresholds</p>

              <div className="space-y-5">
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Low Stock Alerts</p>
                    <p className="text-xs text-slate-400">Get notified when medicines are running low</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notifications.enableLowStock}
                      onChange={(e) => setNotifications({ ...notifications, enableLowStock: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 peer-checked:bg-emerald-500 rounded-full transition-colors cursor-pointer"></div>
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>

                {notifications.enableLowStock && (
                  <div className="pl-4 border-l-2 border-emerald-200">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Low Stock Threshold</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        value={notifications.lowStockThreshold}
                        onChange={(e) => setNotifications({ ...notifications, lowStockThreshold: parseInt(e.target.value) || 0 })}
                        className="w-24 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                      <span className="text-sm text-slate-500">units</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Alert when stock falls below this quantity</p>
                  </div>
                )}

                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Expiry Alerts</p>
                    <p className="text-xs text-slate-400">Get notified before medicines expire</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notifications.enableExpiry}
                      onChange={(e) => setNotifications({ ...notifications, enableExpiry: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 peer-checked:bg-emerald-500 rounded-full transition-colors cursor-pointer"></div>
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>

                {notifications.enableExpiry && (
                  <div className="pl-4 border-l-2 border-emerald-200">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry Alert Window</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        value={notifications.expiryAlertDays}
                        onChange={(e) => setNotifications({ ...notifications, expiryAlertDays: parseInt(e.target.value) || 0 })}
                        className="w-24 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                      <span className="text-sm text-slate-500">days before expiry</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Alert when medicines are within this many days of expiring</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medicine Categories */}
          {activeSection === 'categories' && (
            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Medicine Categories</h2>
              <p className="text-sm text-slate-400 mb-5">Manage medicine types and categories</p>

              <div className="flex gap-3 mb-5">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCategory.trim()) {
                      e.preventDefault()
                      if (!categories.includes(newCategory.trim())) {
                        setCategories([...categories, newCategory.trim()])
                      }
                      setNewCategory('')
                    }
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button
                  onClick={() => {
                    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                      setCategories([...categories, newCategory.trim()])
                      setNewCategory('')
                    }
                  }}
                  className="px-4 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 group hover:border-slate-300 transition-colors">
                    {cat}
                    <button
                      onClick={() => setCategories(categories.filter(c => c !== cat))}
                      className="w-4 h-4 flex items-center justify-center rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-400 mt-4">{categories.length} categories configured</p>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex items-center justify-end gap-3">
            {saved && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium animate-fade-in">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Settings saved successfully!
              </div>
            )}
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
