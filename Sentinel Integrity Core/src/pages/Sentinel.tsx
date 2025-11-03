
/**
 * Sentinel Integrity Layer Dashboard
 * 
 * This page provides a visual interface for the Sentinel Integrity Layer core logic,
 * displaying system-wide audits, compliance checks, and Chain of Command Protocol violations.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { AlertTriangle, CheckCircle, Shield, AlertCircle, Clock, Cpu } from 'lucide-react';
import { runIntegrityScan, MOCK_ASSET_EVENTS, MOCK_OPERATOR_STATUSES, type IntegrityReport, type Violation } from '../modules/sentinel/integrityCheck';

/**
 * Main Sentinel Dashboard Component
 * Displays system integrity status, violations, and compliance metrics
 */
export default function Sentinel() {
  const [report, setReport] = useState<IntegrityReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  /**
   * Execute integrity scan and update report state
   */
  const executeScan = async () => {
    setIsScanning(true);
    try {
      const scanReport = await runIntegrityScan(MOCK_ASSET_EVENTS, MOCK_OPERATOR_STATUSES);
      setReport(scanReport);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Run initial scan on component mount
  useEffect(() => {
    executeScan();
  }, []);

  /**
   * Get color class based on system health score
   */
  const getHealthColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  /**
   * Get severity badge variant
   */
  const getSeverityVariant = (severity: Violation['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'WARNING': return 'secondary';
      case 'NOTICE': return 'outline';
      default: return 'outline';
    }
  };

  /**
   * Get violation type icon
   */
  const getViolationIcon = (type: Violation['type']) => {
    switch (type) {
      case 'TRUST_VIOLATION': return <Shield className="w-4 h-4" />;
      case 'DATA_INTEGRITY': return <Cpu className="w-4 h-4" />;
      case 'PROTOCOL_BREACH': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sentinel Integrity Layer</h1>
              <p className="text-slate-400">Chain of Command Protocol Enforcement</p>
            </div>
          </div>
          <Button 
            onClick={executeScan} 
            disabled={isScanning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isScanning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Run Integrity Scan
              </>
            )}
          </Button>
        </div>

        {report ? (
          <div className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health Score</CardTitle>
                  <CheckCircle className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <span className={getHealthColor(report.systemHealthScore)}>
                      {(report.systemHealthScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Chain of Command Protocol Compliance
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical Assets</CardTitle>
                  <AlertTriangle className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">
                    {report.criticalAssetCount}
                  </div>
                  <p className="text-xs text-slate-400">
                    Assets requiring immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {report.violations.length}
                  </div>
                  <p className="text-xs text-slate-400">
                    Protocol compliance violations
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Violations List */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Compliance Violations</CardTitle>
                <CardDescription>
                  Detected violations of Chain of Command Protocol
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.violations.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p>No violations detected. System is compliant.</p>
                    </div>
                  ) : (
                    report.violations.map((violation) => (
                      <div
                        key={violation.id}
                        className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-750"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-slate-400">
                            {getViolationIcon(violation.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{violation.id}</h3>
                              <Badge variant={getSeverityVariant(violation.severity)}>
                                {violation.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">
                              {violation.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Protocol: {violation.protocolRef}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            Type: {violation.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scan Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">Scan Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timestamp:</span>
                    <span>{new Date(report.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span>{report.scanDurationMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Critical Violations:</span>
                    <span className="text-red-500">
                      {report.violations.filter(v => v.severity === 'CRITICAL').length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">Protocol Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">CCP-3.1:</span>
                    <Badge variant={
                      report.violations.some(v => v.protocolRef === 'CCP-3.1') 
                        ? 'destructive' 
                        : 'outline'
                    }>
                      {report.violations.some(v => v.protocolRef === 'CCP-3.1') ? 'VIOLATED' : 'COMPLIANT'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CCP-4.1:</span>
                    <Badge variant={
                      report.violations.some(v => v.protocolRef === 'CCP-4.1') 
                        ? 'destructive' 
                        : 'outline'
                    }>
                      {report.violations.some(v => v.protocolRef === 'CCP-4.1') ? 'VIOLATED' : 'COMPLIANT'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CCP-4.2:</span>
                    <Badge variant={
                      report.violations.some(v => v.protocolRef === 'CCP-4.2') 
                        ? 'secondary' 
                        : 'outline'
                    }>
                      {report.violations.some(v => v.protocolRef === 'CCP-4.2') ? 'WARNING' : 'COMPLIANT'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-slate-400 animate-spin" />
              <p className="text-slate-400">Initializing Sentinel Integrity Scan...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
