import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuditLog } from '../types';

export const logAdminAction = async (
    adminId: string,
    adminEmail: string,
    action: string,
    targetId: string,
    details?: string
) => {
    try {
        const auditLogsRef = collection(db, 'auditLogs');
        const newLogRef = doc(auditLogsRef);
        const log: AuditLog = {
            id: newLogRef.id,
            adminId,
            adminEmail,
            action,
            targetId,
            details,
            timestamp: Date.now(),
        };
        await setDoc(newLogRef, log);
    } catch (error) {
        console.error("Failed to write audit log", error);
    }
};
