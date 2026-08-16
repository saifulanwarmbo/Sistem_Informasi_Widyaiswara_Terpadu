import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

async function checkDb(dbId: string) {
  const app = initializeApp({ ...config, firestoreDatabaseId: dbId }, dbId);
  const db = getFirestore(app, dbId);
  try {
    const snap = await getDocs(collection(db, 'widyaiswara_profiles'));
    console.log(`DB ${dbId} has ${snap.size} profiles.`);
  } catch (err: any) {
    console.error(`DB ${dbId} error:`, err.message);
  }
}

async function run() {
  await checkDb('ai-studio-e6018620-a677-42d5-a0f4-d85cd82af257');
  await checkDb('ai-studio-sisteminformasiw-e6018620-a677-42d5-a0f4-d85cd82af257');
}
run();
