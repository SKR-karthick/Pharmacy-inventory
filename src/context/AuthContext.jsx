import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = [
    { username: 'admin', password: 'admin123', name: 'Admin', role: 'Administrator' },
    { username: 'pharmacist', password: 'pharma123', name: 'Pharmacist', role: 'Pharmacist' },
]

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const stored = sessionStorage.getItem('pharmacy_user')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setUser(parsed)
                setIsAuthenticated(true)
            } catch {
                sessionStorage.removeItem('pharmacy_user')
            }
        }
        setIsLoading(false)
    }, [])

    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay for realistic feel
            setTimeout(() => {
                const found = DEMO_USERS.find(
                    (u) => u.username === username && u.password === password
                )
                if (found) {
                    const userData = { name: found.name, role: found.role, username: found.username }
                    setUser(userData)
                    setIsAuthenticated(true)
                    sessionStorage.setItem('pharmacy_user', JSON.stringify(userData))
                    resolve(userData)
                } else {
                    reject(new Error('Invalid username or password'))
                }
            }, 800)
        })
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        sessionStorage.removeItem('pharmacy_user')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
