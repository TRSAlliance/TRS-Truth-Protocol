
/**
 * Home Page with Navigation to Sentinel Integrity Layer
 * 
 * Provides the main entry point to the application with access to the Sentinel dashboard
 */

import { Button } from '../components/ui/button'
import { Shield, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-2xl">
              <Shield className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Sentinel Integrity Layer
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Advanced system-wide compliance monitoring and Chain of Command Protocol enforcement
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold mb-3">System Integrity</h3>
              <p className="text-slate-400 mb-4">
                Real-time monitoring of asset events and operator trust levels with automated compliance validation.
              </p>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Chain of Command Protocol (CCP) enforcement</li>
                <li>• Trust rating validation</li>
                <li>• Data integrity verification</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold mb-3">Violation Detection</h3>
              <p className="text-slate-400 mb-4">
                Automated detection of protocol breaches with severity-based alerting and remediation guidance.
              </p>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Critical asset monitoring</li>
                <li>• Operator status validation</li>
                <li>• Protocol compliance tracking</li>
              </ul>
            </div>
          </div>

          {/* Action Section */}
          <div className="text-center">
            <Button 
              onClick={() => navigate('/sentinel')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
              size="lg"
            >
              <Shield className="w-5 h-5 mr-3" />
              Access Sentinel Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-slate-400 mt-4 text-sm">
              System-wide integrity scan and compliance reporting
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
