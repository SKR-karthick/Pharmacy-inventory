# 🏥 Chitra Multi Speciality Clinic — Pharmacy Management System

A modern, full-featured pharmacy inventory and billing management system built for **Chitra Multi Speciality Clinic**. Designed as a demo-ready hospital software solution with real-world workflows.

---

## ✨ Features

### 📋 Dashboard
- Overview of pharmacy operations with key metrics
- Stock status indicators and quick stats

### 💊 Medicine Management
- Add, edit, and delete medicines with barcode support
- Track batch numbers, expiry dates, purchase & selling prices
- Search by name, batch number, or barcode
- Low stock alerts (highlighted in the list)
- 12 pre-loaded sample medicines with unique barcodes

### 🔍 Barcode Scanning (POS-style)
- Real-time barcode scanner input in Purchase Entry
- Enter key detection (how real scanners work)
- Auto-detect on barcode length ≥ 13 characters
- Auto-fills: medicine name, batch, expiry, unit price, supplier
- Visual feedback: green toast (found) / red toast (not found)
- Scan counter tracks items processed
- Smart focus: stays on barcode input, doesn't steal focus from other fields

### 🛒 Purchase Entry
- Record medicine purchases from suppliers
- Barcode-driven workflow — scan, auto-fill, enter quantity, done
- Multi-row entry with add/remove row support
- Auto-calculated totals and grand total
- Invoice details: supplier, invoice number, date

### 💰 Billing & Invoices
- Create patient bills with medicine selection
- Auto-calculated totals with GST
- Print-ready invoice generation (opens in new window)
- Invoice preview card with clinic branding
- Doctor and patient information fields

### 📦 Supplier Management
- Manage supplier records (name, contact, GST, address)
- Active/inactive status tracking

### ⏰ Expiry Alerts
- Dedicated page showing medicines nearing expiry
- Configurable alert window (days before expiry)

### 📊 Reports
- Pharmacy operations reports and analytics

### ⚙️ Settings
- Pharmacy profile (name, address, phone, email, GST, drug license)
- Invoice customization (prefix, footer text, display options)
- Notification preferences (low stock threshold, expiry alert days)
- Medicine category management (add/remove categories)

### 🔐 Authentication
- Login system with protected routes
- Demo credentials: `admin` / `admin123`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **React Context API** | Shared state (medicines, auth) |
| **Tailwind CSS** | Utility-first styling |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd pharmacy-inventory-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5174/`

### Login
- **Username:** `admin`
- **Password:** `admin123`

---

## 📁 Project Structure

```
src/
├── context/
│   ├── AuthContext.jsx          # Authentication state
│   └── MedicinesContext.jsx     # Shared medicines data store
├── layout/
│   ├── MainLayout.jsx           # App shell with header
│   └── Sidebar.jsx              # Navigation sidebar
├── pages/
│   ├── Dashboard.jsx            # Home dashboard
│   ├── Medicines.jsx            # Medicine list with search
│   ├── AddMedicine.jsx          # Add new medicine form
│   ├── EditMedicine.jsx         # Edit existing medicine
│   ├── MedicineDetails.jsx      # Medicine detail view
│   ├── PurchaseEntry.jsx        # Purchase entry with barcode scanner
│   ├── Billing.jsx              # Billing & invoice generation
│   ├── Suppliers.jsx            # Supplier management
│   ├── ExpiryAlerts.jsx         # Expiry alert dashboard
│   ├── Reports.jsx              # Reports & analytics
│   ├── Settings.jsx             # App configuration
│   └── Login.jsx                # Authentication page
└── App.jsx                      # Routes & providers
```

---

## 🏥 Clinic Details

| | |
|---|---|
| **Clinic** | Chitra Multi Speciality Clinic |
| **Address** | Natarajan Street, Muthamizh Nagar, Pammal |
| **City** | Chennai, Tamil Nadu - 600075 |
| **Phone** | 9994914306 |
| **Mobile** | 9994714303 |
| **Email** | chitraclinic@gmail.com |

---

## 📌 Demo Barcodes

Use these barcodes in Purchase Entry to test the scanner:

| Medicine | Barcode |
|----------|---------|
| Paracetamol 500mg | `8901234567890` |
| Amoxicillin 250mg | `8901234567891` |
| Omeprazole 20mg | `8901234567892` |
| Cetirizine 10mg | `8901234567893` |
| Metformin 500mg | `8901234567894` |
| Azithromycin 500mg | `8901234567895` |
| Ibuprofen 400mg | `8901234567896` |
| Pantoprazole 40mg | `8901234567897` |
| Dolo 650mg | `8901234567898` |
| Crocin Advance | `8901234567899` |
| Amlodipine 5mg | `8901234567900` |
| Ciprofloxacin 500mg | `8901234567901` |

---

## 📜 License

This project is a demo application for **Chitra Multi Speciality Clinic**.
