import { createContext, useContext, useState, useEffect } from 'react'

const MedicinesContext = createContext(null)

const initialMedicines = [
    { id: 1, name: 'Paracetamol 500mg', barcode: '8901234567890', category: 'Pain Relief', batchNo: 'BTH-2026-001', expiry: '2027-03-15', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 10, costPerPack: 80, sellingPricePerUnit: 12, totalStockUnits: 2450, quantity: 245, purchasePrice: 8, sellingPrice: 12, supplier: 'MedSupply Co.' },
    { id: 2, name: 'Amoxicillin 250mg', barcode: '8901234567891', category: 'Antibiotics', batchNo: 'BTH-2026-002', expiry: '2026-08-20', purchaseUnit: 'Strip', sellingUnit: 'Capsule', unitsPerPack: 10, costPerPack: 320, sellingPricePerUnit: 45, totalStockUnits: 80, quantity: 8, purchasePrice: 32, sellingPrice: 45, supplier: 'PharmaDist Ltd.' },
    { id: 3, name: 'Omeprazole 20mg', barcode: '8901234567892', category: 'Gastro', batchNo: 'BTH-2026-003', expiry: '2026-12-10', purchaseUnit: 'Strip', sellingUnit: 'Capsule', unitsPerPack: 10, costPerPack: 180, sellingPricePerUnit: 28, totalStockUnits: 1560, quantity: 156, purchasePrice: 18, sellingPrice: 28, supplier: 'HealthCare Plus' },
    { id: 4, name: 'Cetirizine 10mg', barcode: '8901234567893', category: 'Allergy', batchNo: 'BTH-2026-004', expiry: '2027-05-25', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 10, costPerPack: 50, sellingPricePerUnit: 8, totalStockUnits: 3200, quantity: 320, purchasePrice: 5, sellingPrice: 8, supplier: 'MediWholesale' },
    { id: 5, name: 'Metformin 500mg', barcode: '8901234567894', category: 'Diabetes', batchNo: 'BTH-2026-005', expiry: '2026-06-30', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 10, costPerPack: 100, sellingPricePerUnit: 15, totalStockUnits: 120, quantity: 12, purchasePrice: 10, sellingPrice: 15, supplier: 'MedSupply Co.' },
    { id: 6, name: 'Azithromycin 500mg', barcode: '8901234567895', category: 'Antibiotics', batchNo: 'BTH-2026-006', expiry: '2026-09-18', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 6, costPerPack: 360, sellingPricePerUnit: 85, totalStockUnits: 450, quantity: 75, purchasePrice: 60, sellingPrice: 85, supplier: 'PharmaDist Ltd.' },
    { id: 7, name: 'Ibuprofen 400mg', barcode: '8901234567896', category: 'Pain Relief', batchNo: 'BTH-2026-007', expiry: '2027-01-22', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 10, costPerPack: 60, sellingPricePerUnit: 10, totalStockUnits: 50, quantity: 5, purchasePrice: 6, sellingPrice: 10, supplier: 'HealthCare Plus' },
    { id: 8, name: 'Pantoprazole 40mg', barcode: '8901234567897', category: 'Gastro', batchNo: 'BTH-2026-008', expiry: '2027-06-10', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 10, costPerPack: 220, sellingPricePerUnit: 35, totalStockUnits: 1200, quantity: 120, purchasePrice: 22, sellingPrice: 35, supplier: 'MediWholesale' },
    { id: 9, name: 'Dolo 650mg', barcode: '8901234567898', category: 'Pain Relief', batchNo: 'BTH-2026-009', expiry: '2027-04-18', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 15, costPerPack: 180, sellingPricePerUnit: 18, totalStockUnits: 4500, quantity: 300, purchasePrice: 12, sellingPrice: 18, supplier: 'MedSupply Co.' },
    { id: 10, name: 'Crocin Advance', barcode: '8901234567899', category: 'Pain Relief', batchNo: 'BTH-2026-010', expiry: '2027-02-28', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 10, costPerPack: 150, sellingPricePerUnit: 25, totalStockUnits: 2000, quantity: 200, purchasePrice: 15, sellingPrice: 25, supplier: 'PharmaDist Ltd.' },
    { id: 11, name: 'Amlodipine 5mg', barcode: '8901234567900', category: 'Cardiac', batchNo: 'BTH-2026-011', expiry: '2027-07-15', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 10, costPerPack: 180, sellingPricePerUnit: 30, totalStockUnits: 1800, quantity: 180, purchasePrice: 18, sellingPrice: 30, supplier: 'HealthCare Plus' },
    { id: 12, name: 'Ciprofloxacin 500mg', barcode: '8901234567901', category: 'Antibiotics', batchNo: 'BTH-2026-012', expiry: '2026-11-20', purchaseUnit: 'Strip', sellingUnit: 'Tablet', unitsPerPack: 10, costPerPack: 400, sellingPricePerUnit: 62, totalStockUnits: 950, quantity: 95, purchasePrice: 40, sellingPrice: 62, supplier: 'MediWholesale' },
]

export function MedicinesProvider({ children }) {
    const [medicines, setMedicines] = useState(() => {
        const saved = localStorage.getItem('pharmacy-medicines')
        if (saved) {
            const parsed = JSON.parse(saved)
            // Migrate older data that may lack pack fields
            return parsed.map(m => ({
                purchaseUnit: 'Strip',
                sellingUnit: 'Tablet',
                unitsPerPack: 10,
                costPerPack: (m.purchasePrice || 0) * 10,
                sellingPricePerUnit: m.sellingPrice || 0,
                totalStockUnits: (m.quantity || 0) * 10,
                ...m, // existing data wins if fields already present
            }))
        }
        return initialMedicines
    })

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem('pharmacy-medicines', JSON.stringify(medicines))
    }, [medicines])

    const addMedicine = (medicineData) => {
        const newMedicine = {
            ...medicineData,
            id: Date.now(),
        }
        setMedicines((prev) => [...prev, newMedicine])
        return newMedicine
    }

    const updateMedicine = (id, updatedData) => {
        setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, ...updatedData } : m))
    }

    const deleteMedicine = (id) => {
        setMedicines((prev) => prev.filter((m) => m.id !== id))
    }

    // Purchase: add stock in packs
    const addStock = (id, packsAdded, costPerPack, unitsPerPack) => {
        setMedicines((prev) => prev.map((m) => {
            if (m.id !== id) return m
            const unitsAdded = packsAdded * unitsPerPack
            return {
                ...m,
                totalStockUnits: (m.totalStockUnits || 0) + unitsAdded,
                quantity: Math.floor(((m.totalStockUnits || 0) + unitsAdded) / (m.unitsPerPack || 10)),
                costPerPack: costPerPack,
                purchasePrice: Math.round((costPerPack / unitsPerPack) * 100) / 100,
            }
        }))
    }

    // Sell: deduct stock in units
    const deductStock = (id, unitsSold) => {
        setMedicines((prev) => prev.map((m) => {
            if (m.id !== id) return m
            const newTotal = Math.max(0, (m.totalStockUnits || 0) - unitsSold)
            return {
                ...m,
                totalStockUnits: newTotal,
                quantity: Math.floor(newTotal / (m.unitsPerPack || 10)),
            }
        }))
    }

    const findById = (id) => {
        return medicines.find((m) => m.id === id) || null
    }

    const findByBarcode = (barcode) => {
        return medicines.find((m) => m.barcode === barcode) || null
    }

    return (
        <MedicinesContext.Provider value={{ medicines, addMedicine, updateMedicine, deleteMedicine, addStock, deductStock, findById, findByBarcode }}>
            {children}
        </MedicinesContext.Provider>
    )
}

export function useMedicines() {
    const context = useContext(MedicinesContext)
    if (!context) {
        throw new Error('useMedicines must be used within a MedicinesProvider')
    }
    return context
}
