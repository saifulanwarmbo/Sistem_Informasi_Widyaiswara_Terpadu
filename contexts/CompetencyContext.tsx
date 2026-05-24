import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { CompetencyRegistration, AppNotification, RegistrationStatus } from '../types';
import { useAuth } from './AuthContext';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, auth: any) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface CompetencyContextType {
  registrations: CompetencyRegistration[];
  notifications: AppNotification[];
  submitRegistration: (registration: Omit<CompetencyRegistration, 'id'>) => Promise<void>;
  updateRegistrationStatus: (id: string, status: RegistrationStatus, notes?: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

const CompetencyContext = createContext<CompetencyContextType | undefined>(undefined);

export const CompetencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<CompetencyRegistration[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      setRegistrations([]);
      setNotifications([]);
      return;
    }

    let regQuery;
    if (isAdmin) {
      regQuery = query(collection(db, 'competency_registrations'));
    } else {
      regQuery = query(collection(db, 'competency_registrations'), where('ownerId', '==', user.uid));
    }

    const unsubscribeReg = onSnapshot(regQuery, (snapshot) => {
      const regsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CompetencyRegistration));
      setRegistrations(regsData);
    }, (error) => {
      console.error("Error fetching registrations:", error);
    });

    const notifQuery = query(collection(db, 'notifications'), where('userId', '==', user.uid));
    const unsubscribeNotif = onSnapshot(notifQuery, (snapshot) => {
      const notifsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppNotification));
      setNotifications(notifsData.sort((a, b) => b.createdAt - a.createdAt));
    }, (error) => {
      console.error("Error fetching notifications:", error);
    });

    return () => {
      unsubscribeReg();
      unsubscribeNotif();
    };
  }, [user, isAdmin]);

  const submitRegistration = async (registration: Omit<CompetencyRegistration, 'id'>) => {
    try {
      const newDocRef = doc(collection(db, 'competency_registrations'));
      await setDoc(newDocRef, { ...registration, id: newDocRef.id });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'competency_registrations', null);
    }
  };

  const updateRegistrationStatus = async (id: string, status: RegistrationStatus, notes?: string) => {
    try {
      const regRef = doc(db, 'competency_registrations', id);
      const updateData: any = { status, verificationDate: Date.now() };
      if (notes !== undefined) {
        updateData.adminNotes = notes;
      }
      await updateDoc(regRef, updateData);

      const reg = registrations.find(r => r.id === id);
      if (reg) {
        const notifRef = doc(collection(db, 'notifications'));
        let message = `Status pendaftaran Uji Kompetensi Anda telah diperbarui menjadi: ${status === 'verified' ? 'Disetujui' : 'Ditolak'}.`;
        if (notes) {
          message += ` Catatan: ${notes}`;
        }
        await setDoc(notifRef, {
          id: notifRef.id,
          userId: reg.ownerId,
          message,
          read: false,
          createdAt: Date.now()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'competency_registrations', null);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      const notifRef = doc(db, 'notifications', id);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'notifications', null);
    }
  };

  return (
    <CompetencyContext.Provider value={{ registrations, notifications, submitRegistration, updateRegistrationStatus, markNotificationRead }}>
      {children}
    </CompetencyContext.Provider>
  );
};

export const useCompetency = () => {
  const context = useContext(CompetencyContext);
  if (context === undefined) {
    throw new Error('useCompetency must be used within a CompetencyProvider');
  }
  return context;
};
