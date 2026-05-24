
import React from 'react';

const DevelopmentHub: React.FC = () => {
    const resources = [
        { title: 'Pedoman Pengembangan Karya Tulis Ilmiah', description: 'Panduan lengkap untuk penyusunan karya tulis ilmiah bagi Widyaiswara.', link: '#' },
        { title: 'Jadwal Pelatihan Kompetensi Teknis 2024', description: 'Lihat jadwal lengkap pelatihan teknis yang akan diselenggarakan sepanjang tahun.', link: '#' },
        { title: 'Forum Diskusi Widyaiswara Nasional', description: 'Bergabung dengan komunitas untuk berbagi pengetahuan dan pengalaman.', link: '#' },
        { title: 'Materi Seminar "Transformasi Digital dalam Pelatihan"', description: 'Unduh materi dan rekaman seminar terbaru.', link: '#' }
    ];

  return (
    <div className="space-y-8">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-primary">Pusat Pengembangan Profesi</h2>
            <p className="mt-2 text-lg text-medium-text">Sumber daya untuk meningkatkan kompetensi dan profesionalisme Widyaiswara.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="text-lg font-semibold text-dark-text">{resource.title}</h4>
                    <p className="mt-2 text-medium-text">{resource.description}</p>
                    <a href={resource.link} className="inline-block mt-4 text-secondary font-semibold hover:underline">
                        Pelajari Lebih Lanjut &rarr;
                    </a>
                </div>
            ))}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-dark-text mb-4">Agenda Mendatang</h3>
            <ul className="space-y-4">
                <li className="flex items-start">
                    <div className="flex-shrink-0 bg-secondary text-white rounded-md text-center w-20 p-2">
                        <span className="block text-2xl font-bold">25</span>
                        <span className="block text-sm">JUL</span>
                    </div>
                    <div className="ml-4">
                        <p className="font-semibold">Webinar: Implementasi Kurikulum Berbasis Kinerja</p>
                        <p className="text-sm text-medium-text">Online via Zoom | 09:00 - 12:00 WIB</p>
                    </div>
                </li>
                 <li className="flex items-start">
                    <div className="flex-shrink-0 bg-secondary text-white rounded-md text-center w-20 p-2">
                        <span className="block text-2xl font-bold">10</span>
                        <span className="block text-sm">AGU</span>
                    </div>
                    <div className="ml-4">
                        <p className="font-semibold">Workshop: Teknik Penilaian dan Evaluasi Pelatihan</p>
                        <p className="text-sm text-medium-text">Pusdiklat LAN, Jakarta | 2 Hari</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  );
};

export default DevelopmentHub;
