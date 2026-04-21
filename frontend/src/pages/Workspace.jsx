import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../services/api'
import MainLayout from '../components/MainLayout'
import { Briefcase } from 'lucide-react'

export default function Workspace() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getMe()
        setCurrentUser(user)
      } catch (err) {
        navigate('/login', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [navigate])

  return (
    <MainLayout currentUser={currentUser} isLoading={isLoading}>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Briefcase className="text-indigo-600" size={28} />
          <h1 className="text-4xl font-bold text-slate-900">Workspace</h1>
        </div>

        <div className="card bg-gradient-to-br from-indigo-50 to-slate-100 border-dashed border-2 border-indigo-300">
          <div className="text-center py-16">
            <Briefcase size={48} className="mx-auto mb-4 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Coming Soon</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Collaborative workspace features are being developed. Stay tuned for group study sessions, resource sharing, and more!
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
