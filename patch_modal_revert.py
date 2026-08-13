import re

with open('components/ProfileDetailModal.tsx', 'r') as f:
    content = f.read()

# Remove state for viewing doc
state_search = r"const \[loadingDocId, setLoadingDocId\] = useState<string \| null>\(null\);\n  const \[viewingDoc, setViewingDoc\] = useState<\{ url: string, type: string \} \| null>\(null\);"
state_replace = r"const [loadingDocId, setLoadingDocId] = useState<string | null>(null);"
content = re.sub(state_search, state_replace, content)

# Replace handleViewDocument to open in new tab
handle_search = r"const handleViewDocument = async \(id: string, fallbackBase64\?: string\) => \{.*?^\s*};\n"
handle_replace = r"""const handleViewDocument = async (id: string, fallbackBase64?: string) => {
    // Open window synchronously to avoid popup blockers for async operations
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write('<p style="font-family: sans-serif; padding: 20px;">Memuat dokumen...</p>');
    }

    setLoadingDocId(id);
    let base64Data = await getDocument(id);
    if (!base64Data && fallbackBase64) {
        base64Data = fallbackBase64;
    }
    setLoadingDocId(null);
    
    if (!base64Data) {
        if (newWindow) newWindow.close();
        alert("Dokumen tidak ditemukan atau terjadi kesalahan.");
        return;
    }
    
    try {
      const arr = base64Data.split(',');
      if (arr.length < 2) {
          if (newWindow) newWindow.close();
          return;
      }
      
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) {
          if (newWindow) newWindow.close();
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
      
      if (newWindow) {
          newWindow.location.href = url;
          setTimeout(() => URL.revokeObjectURL(url), 10000);
      } else {
          // Fallback if popup was blocked initially
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } catch (e) {
      console.error("Error opening document", e);
      if (newWindow) newWindow.close();
      alert("Tidak dapat membuka dokumen.");
    }
  };
"""
content = re.sub(handle_search, handle_replace, content, flags=re.MULTILINE|re.DOTALL)

# Remove the inline modal JSX
modal_search = r"\{viewingDoc && \(.*?</>\s*$"
modal_replace = r"</>"
content = re.sub(modal_search, modal_replace, content, flags=re.MULTILINE|re.DOTALL)

with open('components/ProfileDetailModal.tsx', 'w') as f:
    f.write(content)

