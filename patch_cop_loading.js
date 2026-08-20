const fs = require('fs');
let file = fs.readFileSync('pages/CommunityOfPractices.tsx', 'utf8');

const target = `const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: CopEvent[] = [];
            snapshot.forEach(doc => data.push(doc.data() as CopEvent));
            setEvents(data);
            setLoading(false);
        });`;

const replacement = `const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: CopEvent[] = [];
            snapshot.forEach(doc => data.push(doc.data() as CopEvent));
            setEvents(data);
            setLoading(false);
        }, (error) => {
            console.error("CoP fetch error:", error);
            showToast('Gagal memuat data: ' + error.message, 'error');
            setLoading(false);
        });`;

file = file.replace(target, replacement);
fs.writeFileSync('pages/CommunityOfPractices.tsx', file);
