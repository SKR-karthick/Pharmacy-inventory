import { createContext, useContext, useState, useEffect } from 'react'

const InvoicesContext = createContext(null)

export function InvoicesProvider({ children }) {
    const [invoices, setInvoices] = useState(() => {
        const saved = localStorage.getItem('pharmacy-invoices')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('pharmacy-invoices', JSON.stringify(invoices))
    }, [invoices])

    const addInvoice = (invoiceData) => {
        const newInvoice = {
            id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            ...invoiceData,
        }
        setInvoices(prev => [newInvoice, ...prev])
        return newInvoice
    }

    // Get all invoices
    const getInvoices = () => invoices

    // Stats
    const totalSales = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
    const totalItems = invoices.reduce((sum, inv) => sum + (inv.itemCount || 0), 0)
    const totalProfit = invoices.reduce((sum, inv) => sum + (inv.profit || 0), 0)

    return (
        <InvoicesContext.Provider value={{ invoices, addInvoice, getInvoices, totalSales, totalItems, totalProfit }}>
            {children}
        </InvoicesContext.Provider>
    )
}

export function useInvoices() {
    const context = useContext(InvoicesContext)
    if (!context) {
        throw new Error('useInvoices must be used within an InvoicesProvider')
    }
    return context
}
