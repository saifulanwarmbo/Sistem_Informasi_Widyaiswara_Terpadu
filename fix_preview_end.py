import re

with open('components/ProfileDetailModal.tsx', 'r') as f:
    content = f.read()

preview_modal = r"""
        {previewUrl && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
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

# Find `</>` and insert preview_modal before it
content = content.replace("</>", preview_modal + "</>")

with open('components/ProfileDetailModal.tsx', 'w') as f:
    f.write(content)

