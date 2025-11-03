
/**
 * SENTINEL INTEGRITY LAYER CORE LOGIC
 * This module defines the core structures and logic for the Sentinel Integrity Layer.
 * It encapsulates the algorithm for system-wide audits and compliance checks
 * based on the Chain of Command Protocol (CCP).
 *
 * This file is the "Sentinel Engine" that the Sentinel.tsx page executes.
 */

// Placeholder types mimicking the core structures from src/lib/operators.ts
// In a fully integrated environment, these would be imported from the lib layer.
export interface Location { latitude: number; longitude: number; zoneId?: string; }
export type StatusCode = 'ERROR' | 'TASK_COMMENCED' | 'COMPLETED' | 'IDLE';

export interface AssetEvent {
    assetUuid: string;
    originKey: string;
    location: Location;
    timestamp: number;
    statusCode: StatusCode;
    dataPayload: Record<string, any>;
}

export interface OperatorStatus {
    operatorId: string;
    trustRating: number;
    currentTaskId: string | null;
    lastKnownLocation: Omit<Location, 'zoneId'>;
    role: 'AGENT' | 'PILOT' | 'COMMAND';
}

// --- 1. SENTINEL DATA STRUCTURES ---

/**
 * Interface for a single compliance violation detected by the Sentinel scan.
 */
export interface Violation {
    id: string; 
    type: 'TRUST_VIOLATION' | 'DATA_INTEGRITY' | 'PROTOCOL_BREACH';
    description: string;
    severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
    protocolRef: string; 
}

/**
 * Interface for the complete Sentinel Integrity Report.
 */
export interface IntegrityReport {
    timestamp: number;
    systemHealthScore: number; 
    criticalAssetCount: number;
    violations: Violation[];
    scanDurationMs: number;
}

// --- 2. SENTINEL INTEGRITY LOGIC ---

/**
 * Executes a full, system-wide integrity and compliance scan.
 * This function applies the Chain of Command Protocol as machine law.
 *
 * @param allEvents The comprehensive stream of Asset Events (the firehose).
 * @param allStatuses The current status of all Operators (the trust engine output).
 * @returns A promise resolving to the final IntegrityReport.
 */
export async function runIntegrityScan(
    allEvents: AssetEvent[], 
    allStatuses: OperatorStatus[]
): Promise<IntegrityReport> {
    const startTime = Date.now();
    const violations: Violation[] = [];
    let criticalAssetCount = 0;

    // --- A. Asset Event and Protocol Breach Check (CCP-3.1 / ERROR STATUS) ---
    allEvents.forEach(event => {
        if (event.statusCode === 'ERROR') {
            criticalAssetCount++;
            // CCP-3.1 Enforcement: Critical error state requires payload for auditing.
            if (!event.dataPayload || Object.keys(event.dataPayload).length === 0) {
                violations.push({
                    id: event.assetUuid,
                    type: 'DATA_INTEGRITY',
                    description: `Asset reported ERROR status without required audit payload.`,
                    severity: 'CRITICAL',
                    protocolRef: 'CCP-3.1',
                });
            }
        }
    });

    // --- B. Operator Trust Violation Check (CCP-4.1 / Trust Level Enforcement) ---
    allStatuses.forEach(status => {
        // CCP-4.1 Enforcement: Sub-baseline trust (0.6) cannot hold an active task.
        if (status.trustRating < 0.6 && status.currentTaskId !== null) {
            violations.push({
                id: status.operatorId,
                type: 'TRUST_VIOLATION',
                description: `Sub-baseline Operator (${status.trustRating.toFixed(2)}) actively assigned to task.`,
                severity: 'CRITICAL',
                protocolRef: 'CCP-4.1',
            });
        } 
        // CCP-4.2 Enforcement: Warning if trust is marginal and requires upskilling path.
        else if (status.trustRating < 0.8 && status.currentTaskId === null) {
             violations.push({
                id: status.operatorId,
                type: 'PROTOCOL_BREACH',
                description: `Operator trust unstable; requires immediate Skill Verification pathway.`,
                severity: 'WARNING',
                protocolRef: 'CCP-4.2',
            });
        }
    });
    
    // --- C. Calculate System Health Score ---
    // Core OS Readiness Algorithm: 1.0 minus penalty for critical breaches.
    const penalty = violations.filter(v => v.severity === 'CRITICAL').length * 0.1;
    let systemHealthScore = Math.max(0.0, 1.0 - penalty); 

    // Final Report Construction
    const scanDurationMs = Date.now() - startTime;
    
    return {
        timestamp: Date.now(),
        systemHealthScore: Math.round(systemHealthScore * 100) / 100,
        criticalAssetCount,
        violations: violations,
        scanDurationMs,
    };
}


// --- 3. MOCK DATA FOR INITIAL TESTING (Matches data used by Sentinel.tsx) ---

export const MOCK_ASSET_EVENTS: AssetEvent[] = [
    { assetUuid: 'ASSET-101', originKey: 'SCAN-A', location: { latitude: 34.0, longitude: -118.0, zoneId: 'Z1' }, timestamp: Date.now(), statusCode: 'TASK_COMMENCED', dataPayload: { taskStep: 2 } },
    { assetUuid: 'ASSET-202', originKey: 'SCAN-B', location: { latitude: 34.1, longitude: -118.1, zoneId: 'Z2' }, timestamp: Date.now(), statusCode: 'ERROR', dataPayload: {} }, // CRITICAL VIOLATION: Missing payload (CCP-3.1)
];

export const MOCK_OPERATOR_STATUSES: OperatorStatus[] = [
    { operatorId: 'OP-JANE', trustRating: 0.95, currentTaskId: 'T-456', lastKnownLocation: { latitude: 34.05, longitude: -118.05 }, role: 'PILOT' },
    { operatorId: 'OP-JOE', trustRating: 0.58, currentTaskId: 'T-789', lastKnownLocation: { latitude: 34.15, longitude: -118.15 }, role: 'AGENT' }, // CRITICAL VIOLATION: Trust below 0.6 on active task (CCP-4.1)
    { operatorId: 'OP-KORE', trustRating: 0.72, currentTaskId: null, lastKnownLocation: { latitude: 34.20, longitude: -118.20 }, role: 'AGENT' }, // WARNING: Trust below 0.8 on idle status (CCP-4.2)
];
