import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Note: Ensure FIREBASE_PROJECT_ID is set if not using default credentials
initializeApp({ projectId: 'ai-studio-e6018620-a677-42d5-a0f4-d85cd82af257' });
const db = getFirestore();

async function findDocs() {
  const profilesSnap = await db.collection('widyaiswara_profiles').get();
  
  let found = 0;
  profilesSnap.forEach(doc => {
    const data = doc.data();
    const name = data.name;
    const nip = data.nip;
    
    let hasDocs = false;
    
    if (data.promotionHistory && Array.isArray(data.promotionHistory)) {
        data.promotionHistory.forEach((item: any) => {
            if (item.documentName || item.documentBase64) {
                console.log(`Profil: ${name} (${nip}) - Riwayat Kenaikan Jenjang: ${item.documentName || 'Dokumen tanpa nama'}`);
                hasDocs = true;
                found++;
            }
        });
    }
    
    if (data.developmentHistory && Array.isArray(data.developmentHistory)) {
        data.developmentHistory.forEach((item: any) => {
            if (item.documentName || item.documentBase64) {
                console.log(`Profil: ${name} (${nip}) - Riwayat Pengembangan: ${item.documentName || 'Dokumen tanpa nama'}`);
                hasDocs = true;
                found++;
            }
        });
    }
  });
  
  console.log(`\nTotal dokumen ditemukan: ${found}`);
}

findDocs().catch(console.error);
