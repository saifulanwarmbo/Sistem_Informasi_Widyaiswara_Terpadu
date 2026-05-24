import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { WidyaiswaraProfile, JobTier, Organization } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

// Helper function to recalculate organization data based on current profiles
const calculateOrganizations = (profiles: WidyaiswaraProfile[], initialOrgs: Organization[]): Organization[] => {
    const orgMap = new Map<string, {
        id: string;
        name: string;
        widyaiswaraCount: { [key in JobTier]: number };
    }>();

    // Initialize map with all base organizations, resetting counts
    initialOrgs.forEach(org => {
        orgMap.set(org.name, {
            id: org.id,
            name: org.name,
            widyaiswaraCount: {
                [JobTier.AhliPertama]: 0,
                [JobTier.AhliMuda]: 0,
                [JobTier.AhliMadya]: 0,
                [JobTier.AhliUtama]: 0,
            }
        });
    });

    // Populate counts from profiles
    profiles.forEach(profile => {
        // If profile's org doesn't exist in the initial list, create it on the fly
        if (!orgMap.has(profile.organization)) {
             orgMap.set(profile.organization, {
                id: `org-${orgMap.size + 100}`, // Use a high number to avoid ID collisions
                name: profile.organization,
                widyaiswaraCount: {
                    [JobTier.AhliPertama]: 0,
                    [JobTier.AhliMuda]: 0,
                    [JobTier.AhliMadya]: 0,
                    [JobTier.AhliUtama]: 0,
                },
            });
        }
        
        const orgData = orgMap.get(profile.organization)!;
        orgData.widyaiswaraCount[profile.tier]++;
    });

    // Calculate totals and convert map back to array of Organization type
    const organizations: Organization[] = [];
    orgMap.forEach((value, name) => {
        const total = Object.values(value.widyaiswaraCount).reduce((sum, count) => sum + count, 0);
        organizations.push({
            id: value.id,
            name: name,
            widyaiswaraCount: value.widyaiswaraCount,
            total,
        });
    });

    return organizations;
};


interface WidyaiswaraContextType {
  profiles: WidyaiswaraProfile[];
  organizations: Organization[];
  addProfile: (profile: Omit<WidyaiswaraProfile, 'id' | 'createdAt' | 'ownerId'>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  updateProfile: (id: string, updatedData: Partial<Omit<WidyaiswaraProfile, 'id' | 'ownerId'>>) => Promise<void>;
  clearAllProfiles: () => Promise<void>;
  updateProfilePhoto: (id: string, photoUrl: string) => Promise<void>;
}

const WidyaiswaraContext = createContext<WidyaiswaraContextType | undefined>(undefined);

export const WidyaiswaraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<WidyaiswaraProfile[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      const loadedProfiles: WidyaiswaraProfile[] = [];
      snapshot.forEach((doc) => {
        loadedProfiles.push({ id: doc.id, ...doc.data() } as WidyaiswaraProfile);
      });
      setProfiles(loadedProfiles);
    }, (error) => {
      console.error("Error fetching profiles:", error);
    });

    return () => unsubscribe();
  }, []);

  // Effect to recalculate organizations whenever profiles change
  useEffect(() => {
      setOrganizations(calculateOrganizations(profiles, []));
  }, [profiles]);

  const addProfile = async (profileData: Omit<WidyaiswaraProfile, 'id' | 'createdAt' | 'ownerId'>) => {
    if (!user) return;
    const newId = doc(collection(db, 'profiles')).id;
    const newProfile: WidyaiswaraProfile = {
      ...profileData,
      id: newId,
      createdAt: Date.now(),
      ownerId: user.uid,
    };
    if (!newProfile.photoUrl) {
        newProfile.photoUrl = `https://picsum.photos/seed/${newProfile.id}/200`;
    }
    
    try {
      await setDoc(doc(db, 'profiles', newId), newProfile);
    } catch (error) {
      console.error("Error adding profile:", error);
      throw error;
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'profiles', id));
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  };
  
  const updateProfile = async (id: string, updatedData: Partial<Omit<WidyaiswaraProfile, 'id' | 'ownerId'>>) => {
    try {
      await updateDoc(doc(db, 'profiles', id), updatedData);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const updateProfilePhoto = async (id: string, photoUrl: string) => {
    try {
      await updateDoc(doc(db, 'profiles', id), { photoUrl });
    } catch (error) {
      console.error("Error updating profile photo:", error);
      throw error;
    }
  };

  const clearAllProfiles = async () => {
    // This is a dangerous operation, usually you'd want to iterate and delete or use a batch
    // For simplicity, we'll just log a warning as deleting all documents from client is not recommended
    console.warn("clearAllProfiles is not fully implemented for Firestore to prevent accidental mass deletion.");
  };

  return (
    <WidyaiswaraContext.Provider value={{ profiles, organizations, addProfile, deleteProfile, clearAllProfiles, updateProfilePhoto, updateProfile }}>
      {children}
    </WidyaiswaraContext.Provider>
  );
};

export const useWidyaiswara = () => {
  const context = useContext(WidyaiswaraContext);
  if (context === undefined) {
    throw new Error('useWidyaiswara must be used within a WidyaiswaraProvider');
  }
  return context;
};