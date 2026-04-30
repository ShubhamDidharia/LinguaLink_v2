import React from 'react'
import { Heart, Mail, Github, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <span className="text-xl font-bold text-white">DuoClick</span>
            </div>
            <p className="text-sm text-slate-400">Connect, learn, and grow with language partners worldwide.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Security</a></li>
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">About</a></li>
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Terms</a></li>
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Cookies</a></li>
              <li><a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">License</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>© {currentYear} DuoClick. Made with</span>
            <Heart size={16} className="text-red-500 fill-current" />
            <span>for language learners.</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">
              <Mail size={18} />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">
              <Github size={18} />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
