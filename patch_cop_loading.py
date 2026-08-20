import os

with open('pages/CommunityOfPractices.tsx', 'r') as f:
    content = f.read()

target = """        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: CopEvent[] = [];
            snapshot.forEach(doc => data.push(doc.data() as CopEvent));
            setEvents(data);
            setLoading(false);
        });"""

replacement = """        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: CopEvent[] = [];
            snapshot.forEach(doc => data.push(doc.data() as CopEvent));
            setEvents(data);
            setLoading(false);
        }, (error) => {
            console.error("CoP fetch error:", error);
            setLoading(false);
        });"""

content = content.replace(target, replacement)

with open('pages/CommunityOfPractices.tsx', 'w') as f:
    f.write(content)
