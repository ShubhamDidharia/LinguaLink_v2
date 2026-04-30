import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../services/api'
import MainLayout from '../components/MainLayout'
import { CreditCard, Check } from 'lucide-react'

export default function Billing() {
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

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Connect with other learners',
        '1-to-1 messaging',
        'Basic profile',
        'Browse community'
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'Enhance your learning experience',
      features: [
        'Unlimited connections',
        'Priority messaging',
        'Advanced profile',
        'Browse community',
        'Video calls',
        'Language resources'
      ],
      recommended: true
    },
    {
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      description: 'Full access to all features',
      features: [
        'Unlimited everything',
        'Priority support',
        'Advanced profile',
        'Browse community',
        'Video calls',
        'Language resources',
        'Custom learning paths',
        'Certified tutors'
      ]
    }
  ]

  return (
    <MainLayout currentUser={currentUser} isLoading={isLoading}>
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-amber-50 via-white to-purple-100 min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="text-indigo-600" size={28} />
          <h1 className="text-4xl font-bold text-slate-900">Billing & Plans</h1>
        </div>

        {/* Current Plan */}
        {currentUser && (
          <div className="mb-12 p-6 bg-indigo-50/80 backdrop-blur-md border border-indigo-200/50 rounded-xl">
            <p className="text-sm text-indigo-700 font-medium mb-1">Current Plan</p>
            <p className="text-2xl font-bold text-slate-900">
              {currentUser.subscription ? 'Premium' : 'Basic'}
            </p>
            <p className="text-slate-600 mt-2">
              {currentUser.subscription
                ? 'You have full access to all DuoClick features'
                : 'Upgrade to unlock premium features'}
            </p>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-soft-lg p-6 flex flex-col ${
                plan.recommended
                  ? 'ring-2 ring-indigo-600 shadow-soft-lg relative'
                  : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                <div>
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-600">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={
                  currentUser?.subscription && plan.name === 'Premium'
                    ? 'btn-secondary w-full cursor-default'
                    : plan.recommended
                    ? 'btn-primary w-full'
                    : 'btn-secondary w-full'
                }
              >
                {currentUser?.subscription && plan.name === 'Premium'
                  ? 'Current Plan'
                  : `Get ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! Cancel your subscription anytime without penalty. You will have access until the end of your billing period.'
              },
              {
                q: 'Do you offer a free trial?',
                a: 'Yes! Start with our free Basic plan to explore DuoClick before upgrading to Pro or Premium.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and other digital payment methods for your convenience.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="card">
                <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
