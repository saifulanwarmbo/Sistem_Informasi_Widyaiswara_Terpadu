
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { auth, loginWithGoogle, logoutFromFirebase, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { AppUser } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  appUser: AppUser | null;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Clean up previous user listener if it exists
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = undefined;
      }
      
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        
        // Check if user document exists, if not create it
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const isDefaultAdmin = currentUser.email === 'saiful.anwarmbo@gmail.com';
            const newUser: AppUser = {
              id: currentUser.uid,
              email: currentUser.email || '',
              role: isDefaultAdmin ? 'admin' : 'widyaiswara',
              createdAt: Date.now()
            };
            await setDoc(userRef, newUser);
            setAppUser(newUser);
          } else {
            setAppUser(userSnap.data() as AppUser);
          }
        } catch (error) {
          console.error("Error setting up user profile:", error);
        }

        // Listen for role changes
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setAppUser(docSnap.data() as AppUser);
          }
        }, (error) => {
          console.error("Error listening to user document:", error);
        });

        setIsLoading(false);
      } else {
        setAppUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, []);

  const login = async () => {
    await loginWithGoogle();
  };

  const logout = async () => {
    await logoutFromFirebase();
  };

  const isAdmin = appUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, appUser, isAdmin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
