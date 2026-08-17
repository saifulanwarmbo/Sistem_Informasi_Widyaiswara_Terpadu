const fs = require('fs');
let file = fs.readFileSync('pages/DevelopmentHub.tsx', 'utf8');

const targetImport = "import { DevelopmentResource, Agenda } from '../types';";
const replacementImport = "import { DevelopmentResource, Agenda, CopEvent } from '../types';";
file = file.replace(targetImport, replacementImport);

const targetState = "const [agendas, setAgendas] = useState<Agenda[]>([]);";
const replacementState = `const [agendas, setAgendas] = useState<Agenda[]>([]);
    const [copEvents, setCopEvents] = useState<Agenda[]>([]);`;
file = file.replace(targetState, replacementState);

const targetFetch = `        const agendasQuery = query(collection(db, 'agendas'), orderBy('date', 'asc'));
        const unsubscribeAgendas = onSnapshot(agendasQuery, (snapshot) => {
            const data: Agenda[] = [];
            snapshot.forEach(doc => data.push(doc.data() as Agenda));
            setAgendas(data);
            setLoading(false);
        });

        return () => {
            unsubscribeResources();
            unsubscribeAgendas();
        };`;

const replacementFetch = `        const agendasQuery = query(collection(db, 'agendas'), orderBy('date', 'asc'));
        const unsubscribeAgendas = onSnapshot(agendasQuery, (snapshot) => {
            const data: Agenda[] = [];
            snapshot.forEach(doc => data.push(doc.data() as Agenda));
            setAgendas(data);
        });

        const copQuery = query(collection(db, 'cop_events'), orderBy('date', 'asc'));
        const unsubscribeCop = onSnapshot(copQuery, (snapshot) => {
            const data: Agenda[] = [];
            snapshot.forEach(doc => {
                const cop = doc.data() as CopEvent;
                data.push({
                    id: cop.id,
                    title: \`[CoP] \${cop.title}\`,
                    date: cop.date,
                    location: cop.location,
                    createdAt: cop.createdAt,
                    isCop: true // internal marker if needed
                } as Agenda & { isCop: boolean });
            });
            setCopEvents(data);
            setLoading(false);
        });

        return () => {
            unsubscribeResources();
            unsubscribeAgendas();
            unsubscribeCop();
        };`;

file = file.replace(targetFetch, replacementFetch);

// Now change the rendering to use merged agendas
const targetRender = "const combinedAgendas = agendas;"; // Just a placeholder idea, but wait, the rendering maps `agendas.map`
const targetMap = "{agendas.map((agenda) => {";
const replacementMap = `{[...agendas, ...copEvents].sort((a,b) => a.date - b.date).map((agenda) => {`;
file = file.replace(targetMap, replacementMap);

// Change the empty check
const targetEmpty = "if (agendas.length === 0)"; // wait, let's see how it checks
const targetEmptyCheck = "{agendas.length === 0 ? (";
const replacementEmptyCheck = "{([...agendas, ...copEvents]).length === 0 ? (";
file = file.replace(targetEmptyCheck, replacementEmptyCheck);

// Also prevent editing/deleting CoP events from Agenda modal
const targetAction = `<button onClick={() => openEditAgenda(agenda)} className="text-gray-500 hover:text-primary">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                                            </button>
                                            <button onClick={() => handleDeleteAgenda(agenda.id, agenda.title)} className="text-gray-500 hover:text-red-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>`;
const replacementAction = `{!(agenda as any).isCop && (
                                            <>
                                                <button onClick={() => openEditAgenda(agenda)} className="text-gray-500 hover:text-primary">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                                                </button>
                                                <button onClick={() => handleDeleteAgenda(agenda.id, agenda.title)} className="text-gray-500 hover:text-red-500">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </>
                                        )}`;
file = file.replace(targetAction, replacementAction);

fs.writeFileSync('pages/DevelopmentHub.tsx', file);
