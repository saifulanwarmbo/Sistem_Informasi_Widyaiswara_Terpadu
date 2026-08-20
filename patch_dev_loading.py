import os

with open('pages/DevelopmentHub.tsx', 'r') as f:
    content = f.read()

target = """        const unsubscribeCop = onSnapshot(copQuery, (snapshot) => {
            const data: Agenda[] = [];
            snapshot.forEach(doc => {
                const cop = doc.data() as CopEvent;
                data.push({
                    id: cop.id,
                    title: `[CoP] ${cop.title}`,
                    date: cop.date,
                    location: cop.location,
                    createdAt: cop.createdAt,
                    isCop: true // internal marker if needed
                } as Agenda & { isCop: boolean });
            });
            setCopEvents(data);
            setLoading(false);
        });"""

replacement = """        const unsubscribeCop = onSnapshot(copQuery, (snapshot) => {
            const data: Agenda[] = [];
            snapshot.forEach(doc => {
                const cop = doc.data() as CopEvent;
                data.push({
                    id: cop.id,
                    title: `[CoP] ${cop.title}`,
                    date: cop.date,
                    location: cop.location,
                    createdAt: cop.createdAt,
                    isCop: true // internal marker if needed
                } as Agenda & { isCop: boolean });
            });
            setCopEvents(data);
            setLoading(false);
        }, (error) => {
            console.error("CoP devhub fetch error:", error);
            setLoading(false);
        });"""

content = content.replace(target, replacement)

with open('pages/DevelopmentHub.tsx', 'w') as f:
    f.write(content)
