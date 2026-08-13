import re

with open('components/ProfileDetailModal.tsx', 'r') as f:
    content = f.read()

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
          newWindow.document.open();
          if (mime.includes('image')) {
              newWindow.document.write(`
                <html>
                  <head><title>Pratinjau Dokumen</title></head>
                  <body style="margin: 0; display: flex; justify-content: center; align-items: center; background-color: #0f172a; height: 100vh;">
                    <img src="${url}" style="max-width: 100%; max-height: 100vh; object-fit: contain;" />
                  </body>
                </html>
              `);
          } else {
              newWindow.document.write(`
                <html>
                  <head><title>Pratinjau Dokumen</title></head>
                  <body style="margin: 0; padding: 0; overflow: hidden; background-color: #525659;">
                    <iframe src="${url}" style="width: 100%; height: 100vh; border: none;"></iframe>
                  </body>
                </html>
              `);
          }
          newWindow.document.close();
          
          // Clean up memory after the iframe/image has had time to load
          setTimeout(() => URL.revokeObjectURL(url), 60000); 
      } else {
          // Fallback if popup was blocked initially
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      console.error("Error opening document", e);
      if (newWindow) newWindow.close();
      alert("Tidak dapat membuka dokumen.");
    }
  };
"""
content = re.sub(handle_search, handle_replace, content, flags=re.MULTILINE|re.DOTALL)

with open('components/ProfileDetailModal.tsx', 'w') as f:
    f.write(content)

