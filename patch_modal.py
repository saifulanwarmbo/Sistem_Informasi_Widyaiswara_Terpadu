import re

with open('components/ProfileDetailModal.tsx', 'r') as f:
    content = f.read()

# Add state for viewing doc
state_search = r"const \[loadingDocId, setLoadingDocId\] = useState<string \| null>\(null\);"
state_replace = r"""const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const [viewingDoc, setViewingDoc] = useState<{ url: string, type: string } | null>(null);"""
content = re.sub(state_search, state_replace, content)

# Replace handleViewDocument
handle_search = r"const handleViewDocument = async \(id: string, fallbackBase64\?: string\) => \{.*?^\s*};\n"
handle_replace = r"""const handleViewDocument = async (id: string, fallbackBase64?: string) => {
    setLoadingDocId(id);
    let base64Data = await getDocument(id);
    if (!base64Data && fallbackBase64) {
        base64Data = fallbackBase64;
    }
    setLoadingDocId(null);
    
    if (!base64Data) {
        alert("Dokumen tidak ditemukan atau terjadi kesalahan.");
        return;
    }
    
    try {
      const arr = base64Data.split(',');
      if (arr.length < 2) return;
      
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) return;
      
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      
      setViewingDoc({ url, type: mime });
    } catch (e) {
      console.error("Error opening document", e);
      alert("Tidak dapat membuka dokumen.");
    }
  };
"""
content = re.sub(handle_search, handle_replace, content, flags=re.MULTILINE|re.DOTALL)

# Add the modal rendering logic
render_search = r"(</>)(?!.*</>)" # find the last </>
modal_jsx = r"""
      {viewingDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Pratinjau Dokumen</h3>
              <button onClick={() => {
                if (viewingDoc.url) URL.revokeObjectURL(viewingDoc.url);
                setViewingDoc(null);
              }} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center">
              {viewingDoc.type.includes('image') ? (
                <img src={viewingDoc.url} alt="Dokumen" className="max-w-full h-auto object-contain" />
              ) : viewingDoc.type.includes('pdf') ? (
                <iframe src={viewingDoc.url} title="Dokumen PDF" className="w-full h-full border-0" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Format dokumen tidak dapat dipratinjau secara langsung.
                  <a href={viewingDoc.url} download="dokumen" className="ml-2 text-primary hover:underline">Unduh file</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>"""

content = content.replace('</>', modal_jsx)

with open('components/ProfileDetailModal.tsx', 'w') as f:
    f.write(content)

