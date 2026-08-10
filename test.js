const test = `
  const handleViewDocument = async (id: string) => {
    setLoadingDocId(id);
    const base64Data = await getDocument(id);
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
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
          setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
    } catch (e) {
      console.error("Error opening PDF", e);
      alert("Tidak dapat membuka dokumen.");
    }
  };
`
