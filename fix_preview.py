import re

with open('components/ProfileDetailModal.tsx', 'r') as f:
    content = f.read()

# Add states
state_search = r"const \[loadingDocId, setLoadingDocId\] = useState<string \| null>\(null\);"
state_replace = r"""const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | null>(null);"""
content = re.sub(state_search, state_replace, content)

# Replace handleViewDocument
handle_search = r"const handleViewDocument = async \(id: string, fallbackBase64\?: string\) => \{.*?\n  };\n"
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
      if (arr.length < 2) {
          return;
      }
      
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) {
          return;
      }
      
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      
      setPreviewType(mime.includes('image') ? 'image' : 'pdf');
      setPreviewUrl(url);
    } catch (e) {
      alert("Tidak dapat membuka dokumen.");
    }
  };
"""
content = re.sub(handle_search, handle_replace, content, flags=re.MULTILINE|re.DOTALL)

# Add Preview Modal rendering at the end, just before the final </div> of the main modal
preview_modal = r"""
        {previewUrl && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-semibold text-lg">Pratinjau Dokumen</h3>
                        <div className="flex items-center space-x-4">
                            <a 
                                href={previewUrl} 
                                download="dokumen" 
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors text-sm font-medium"
                            >
                                Unduh
                            </a>
                            <button 
                                onClick={() => {
                                    URL.revokeObjectURL(previewUrl);
                                    setPreviewUrl(null);
                                }} 
                                className="text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
                        {previewType === 'image' ? (
                            <img src={previewUrl} alt="Dokumen" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <iframe src={previewUrl} className="w-full h-full border-none shadow-sm bg-white" title="Pratinjau PDF" />
                        )}
                    </div>
                </div>
            </div>
        )}
"""

# We'll insert it right before the final `</div>` of the ProfileDetailModal.
# Let's find the `</div>` that is before `);` at the end.
end_search = r"(</div>\s*</div>\s*</div>\s*\)\s*;\s*}$)"
end_replace = preview_modal + r"\n\1"
content = re.sub(end_search, end_replace, content, flags=re.MULTILINE)

with open('components/ProfileDetailModal.tsx', 'w') as f:
    f.write(content)

