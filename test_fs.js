import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function test() {
  try {
    const d = await getDoc(doc(db, 'settings', 'test'));
    console.log("Success", d.exists());
    process.exit(0);
  } catch(e) {
    console.error("FAIL", e.message);
    process.exit(1);
  }
}
test();
