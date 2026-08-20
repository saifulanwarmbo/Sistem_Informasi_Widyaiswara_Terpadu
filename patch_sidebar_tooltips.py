import os

with open('components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Update navItems
old_navItems = """const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { path: '/profiles', label: 'Profil Widyaiswara', icon: ICONS.profiles },
  { path: '/self-registration', label: 'Registrasi Mandiri', icon: ICONS.selfRegister },
  { path: '/job-tiers', label: 'Jenjang Jabatan', icon: ICONS.tiers },
  { path: '/organizations', label: 'Instansi', icon: ICONS.organizations },
  { path: '/development-hub', label: 'Pengembangan Profesi', icon: ICONS.development },
  { path: '/community-of-practices', label: 'Community of Practices', icon: ICONS.users },
  { path: '/competency-test', label: 'Uji Kompetensi', icon: ICONS.document },
];"""

new_navItems = """const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard, tooltip: 'Ringkasan statistik dan metrik data Widyaiswara' },
  { path: '/profiles', label: 'Profil Widyaiswara', icon: ICONS.profiles, tooltip: 'Direktori pencarian dan detail profil Widyaiswara' },
  { path: '/self-registration', label: 'Registrasi Mandiri', icon: ICONS.selfRegister, tooltip: 'Pendaftaran mandiri profil Widyaiswara baru' },
  { path: '/job-tiers', label: 'Jenjang Jabatan', icon: ICONS.tiers, tooltip: 'Distribusi dan statistik Widyaiswara berdasarkan jenjang' },
  { path: '/organizations', label: 'Instansi', icon: ICONS.organizations, tooltip: 'Sebaran dan metrik Widyaiswara per instansi' },
  { path: '/development-hub', label: 'Pengembangan Profesi', icon: ICONS.development, tooltip: 'Informasi program pengembangan dan pelatihan profesi' },
  { path: '/community-of-practices', label: 'Community of Practices', icon: ICONS.users, tooltip: 'Wadah kolaborasi dan komunitas praktik' },
  { path: '/competency-test', label: 'Uji Kompetensi', icon: ICONS.document, tooltip: 'Informasi dan pendaftaran uji kompetensi' },
];"""

content = content.replace(old_navItems, new_navItems)

# Update adminNavItems
old_adminNavItems = """const adminNavItems = [
    { path: '/input-data', label: 'Input Data', icon: ICONS.inputData },
    { path: '/verify-competency', label: 'Verifikasi Uji Kompetensi', icon: ICONS.document },
    { path: '/manage-admins', label: 'Kelola Admin', icon: ICONS.users },
    { path: '/audit-logs', label: 'Log Audit', icon: ICONS.chart },
];"""

new_adminNavItems = """const adminNavItems = [
    { path: '/input-data', label: 'Input Data', icon: ICONS.inputData, tooltip: 'Kelola dan masukkan data master Widyaiswara' },
    { path: '/verify-competency', label: 'Verifikasi Uji Kompetensi', icon: ICONS.document, tooltip: 'Tinjau dan verifikasi pengajuan uji kompetensi' },
    { path: '/manage-admins', label: 'Kelola Admin', icon: ICONS.users, tooltip: 'Pengaturan hak akses dan daftar administrator' },
    { path: '/audit-logs', label: 'Log Audit', icon: ICONS.chart, tooltip: 'Pantau riwayat aktivitas dan perubahan sistem' },
];"""

content = content.replace(old_adminNavItems, new_adminNavItems)

# Add title attribute to the regular NavLinks
old_navlink = """          <NavLink key={item.path}
            to={item.path}
            onClick={handleLinkClick}"""

new_navlink = """          <NavLink key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            title={item.tooltip}"""

content = content.replace(old_navlink, new_navlink)

# Write back
with open('components/Sidebar.tsx', 'w') as f:
    f.write(content)
