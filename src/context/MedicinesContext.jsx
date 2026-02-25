import { createContext, useContext, useState } from 'react'

const MedicinesContext = createContext(null)

const initialMedicines = [
    { id: 1, name: 'Paracetamol 500mg', barcode: '8901234567890', category: 'Pain Relief', batchNo: 'BTH-2026-001', expiry: '2027-03-15', quantity: 245, purchasePrice: 8, sellingPrice: 12, supplier: 'MedSupply Co.' },
    { id: 2, name: 'Amoxicillin 250mg', barcode: '8901234567891', category: 'Antibiotics', batchNo: 'BTH-2026-002', expiry: '2026-08-20', quantity: 8, purchasePrice: 32, sellingPrice: 45, supplier: 'PharmaDist Ltd.' },
    { id: 3, name: 'Omeprazole 20mg', barcode: '8901234567892', category: 'Gastro', batchNo: 'BTH-2026-003', expiry: '2026-12-10', quantity: 156, purchasePrice: 18, sellingPrice: 28, supplier: 'HealthCare Plus' },
    { id: 4, name: 'Cetirizine 10mg', barcode: '8901234567893', category: 'Allergy', batchNo: 'BTH-2026-004', expiry: '2027-05-25', quantity: 320, purchasePrice: 5, sellingPrice: 8, supplier: 'MediWholesale' },
    { id: 5, name: 'Metformin 500mg', barcode: '8901234567894', category: 'Diabetes', batchNo: 'BTH-2026-005', expiry: '2026-06-30', quantity: 12, purchasePrice: 10, sellingPrice: 15, supplier: 'MedSupply Co.' },
    { id: 6, name: 'Azithromycin 500mg', barcode: '8901234567895', category: 'Antibiotics', batchNo: 'BTH-2026-006', expiry: '2026-09-18', quantity: 75, purchasePrice: 60, sellingPrice: 85, supplier: 'PharmaDist Ltd.' },
    { id: 7, name: 'Ibuprofen 400mg', barcode: '8901234567896', category: 'Pain Relief', batchNo: 'BTH-2026-007', expiry: '2027-01-22', quantity: 5, purchasePrice: 6, sellingPrice: 10, supplier: 'HealthCare Plus' },
    { id: 8, name: 'Pantoprazole 40mg', barcode: '8901234567897', category: 'Gastro', batchNo: 'BTH-2026-008', expiry: '2027-06-10', quantity: 120, purchasePrice: 22, sellingPrice: 35, supplier: 'MediWholesale' },
    { id: 9, name: 'Dolo 650mg', barcode: '8901234567898', category: 'Pain Relief', batchNo: 'BTH-2026-009', expiry: '2027-04-18', quantity: 300, purchasePrice: 12, sellingPrice: 18, supplier: 'MedSupply Co.' },
    { id: 10, name: 'Crocin Advance', barcode: '8901234567899', category: 'Pain Relief', batchNo: 'BTH-2026-010', expiry: '2027-02-28', quantity: 200, purchasePrice: 15, sellingPrice: 25, supplier: 'PharmaDist Ltd.' },
    { id: 11, name: 'Amlodipine 5mg', barcode: '8901234567900', category: 'Cardiac', batchNo: 'BTH-2026-011', expiry: '2027-07-15', quantity: 180, purchasePrice: 18, sellingPrice: 30, supplier: 'HealthCare Plus' },
    { id: 12, name: 'Ciprofloxacin 500mg', barcode: '8901234567901', category: 'Antibiotics', batchNo: 'BTH-2026-012', expiry: '2026-11-20', quantity: 95, purchasePrice: 40, sellingPrice: 62, supplier: 'MediWholesale' },
]

export function MedicinesProvider({ children }) {
    const [medicines, setMedicines] = useState(initialMedicines)

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

    const findById = (id) => {
        return medicines.find((m) => m.id === id) || null
    }

    const findByBarcode = (barcode) => {
        return medicines.find((m) => m.barcode === barcode) || null
    }

    return (
        <MedicinesContext.Provider value={{ medicines, addMedicine, updateMedicine, deleteMedicine, findById, findByBarcode }}>
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
