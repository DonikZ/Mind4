import React, { useState } from 'react';
import {
  User,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Edit3,
  Award,
  Clock,
  Activity,
  CheckCircle2,
  Lock,
  Camera,
  LogOut,
  Sparkles,
  Layers,
  Wrench,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { EditProfileModal } from '../profile/EditProfileModal';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onNavigateToView?: (view: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onNavigateToView,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Format date of birth to Indonesian format
  const formatBirthDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  // Calculate age
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      const birth = new Date(dateStr);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age > 0 ? age : null;
    } catch {
      return null;
    }
  };

  const age = calculateAge(user.birthDate);

  return (
    <div id="profile-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
            Profil Pengguna
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
            Informasi identitas personel, kredensial teknis SCADA, dan histori operasional pemeliharaan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            id="edit-profile-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profil
          </button>
          <button
            onClick={onLogout}
            id="logout-btn"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] hover:bg-red-500/10 hover:border-red-500/40 text-xs font-medium text-slate-500 dark:text-[#8A929B] hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar (Logout)
          </button>
        </div>
      </div>

      {/* Main Profile Hero Card */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] relative overflow-hidden">
        {/* Subtle background ambient line */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Profile Avatar / Photo */}
            <div className="relative group shrink-0">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/60 shadow-lg bg-white dark:bg-[#0F1113]">
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Dot */}
              <div
                title="Status Personel: Aktif bertugas di Plant A"
                className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#151719] flex items-center justify-center shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>

              {/* Quick Hover overlay to Edit */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-medium transition-opacity cursor-pointer"
              >
                <Camera className="w-4 h-4 mb-0.5" />
                <span>Ubah</span>
              </button>
            </div>

            {/* User Title & Identity Overview */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-[#E1E4E6] tracking-tight">
                  {user.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {user.employeeId}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Aktif Bertugas
                </span>
              </div>

              {/* Jabatan / Job Title */}
              <div className="flex items-center gap-2 text-sm text-blue-400 font-medium">
                <Briefcase className="w-4 h-4 shrink-0 text-blue-400" />
                <span>{user.position}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-[#8A929B] pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-[#4B5259]" />
                  {user.department}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#4B5259]" />
                  Lahir: <strong className="text-slate-900 dark:text-[#E1E4E6] font-normal">{formatBirthDate(user.birthDate)}</strong>
                  {age && <span className="text-slate-400 dark:text-[#4B5259]">({age} thn)</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8A929B] block font-semibold">
                Otoritas SCADA
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                Level 3 (Supervisor)
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8A929B] block font-semibold">
                Siklus Uptime
              </span>
              <span className="text-sm font-bold font-mono text-blue-400">
                99.4%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Profile Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal Data & Credentials (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detailed Personal Profile Information */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#24272A]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Data Pribadi & Kepegawaian
              </h3>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                Ubah Data
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Nama */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <span className="text-slate-500 dark:text-[#8A929B] font-medium block">Nama Lengkap</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] block">
                  {user.name}
                </span>
              </div>

              {/* Tanggal Lahir */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <span className="text-slate-500 dark:text-[#8A929B] font-medium block">Tanggal Lahir</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] block">
                  {formatBirthDate(user.birthDate)}
                  {age && (
                    <span className="text-xs font-normal text-slate-500 dark:text-[#8A929B] ml-1.5 font-mono">
                      ({age} tahun)
                    </span>
                  )}
                </span>
              </div>

              {/* Jabatan */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <span className="text-slate-500 dark:text-[#8A929B] font-medium block">Jabatan / Posisi</span>
                <span className="text-sm font-semibold text-blue-400 block">
                  {user.position}
                </span>
              </div>

              {/* Departemen */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <span className="text-slate-500 dark:text-[#8A929B] font-medium block">Unit / Departemen</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] block">
                  {user.department}
                </span>
              </div>

              {/* ID Karyawan */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <span className="text-slate-500 dark:text-[#8A929B] font-medium block">Nomor Induk Karyawan</span>
                <span className="text-sm font-mono font-semibold text-slate-900 dark:text-[#E1E4E6] block">
                  {user.employeeId}
                </span>
              </div>

              {/* Tanggal Bergabung */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <span className="text-slate-500 dark:text-[#8A929B] font-medium block">Mulai Bertugas</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] block">
                  {user.joinDate ? formatBirthDate(user.joinDate) : '15 Maret 2019'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Security Info */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-[#24272A]">
              <Mail className="w-4 h-4 text-blue-400" />
              Kontak & Saluran Komunikasi Pabrik
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <span className="text-slate-500 dark:text-[#8A929B] font-medium block">Alamat Email Resmi</span>
                <span className="text-sm font-medium text-slate-900 dark:text-[#E1E4E6] block font-mono">
                  {user.email}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <span className="text-slate-500 dark:text-[#8A929B] font-medium block">Nomor Telepon Seluler</span>
                <span className="text-sm font-medium text-slate-900 dark:text-[#E1E4E6] block font-mono">
                  {user.phoneNumber || '+62 812-9876-5432'}
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Spesialisasi Teknis */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Ringkasan Profil & Spesialisasi Insinyur
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8A929B] leading-relaxed">
              {user.bio ||
                'Spesialis pemeliharaan prediktif berbasis getaran (Vibration Analysis ISO 10816), integrasi SCADA, dan pemodelan degradasi bearing multi-variat untuk fasilitas manufaktur otomasi.'}
            </p>
          </div>
        </div>

        {/* Right Column: Industrial Certifications & Access Permissions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Security & Access Badges */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-[#24272A]">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Izin Akses & Keamanan Sistem
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span className="text-slate-900 dark:text-[#E1E4E6]">Akses Telemetri Real-Time</span>
                </div>
                <span className="font-mono text-[11px] text-green-400">Granted</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span className="text-slate-900 dark:text-[#E1E4E6]">Disposisi Work Order & SPK</span>
                </div>
                <span className="font-mono text-[11px] text-green-400">Granted</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span className="text-slate-900 dark:text-[#E1E4E6]">Override Parameter & Kalibrasi</span>
                </div>
                <span className="font-mono text-[11px] text-green-400">Level 3</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A]">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="text-slate-900 dark:text-[#E1E4E6]">Autentikasi Dua Faktor (2FA)</span>
                </div>
                <span className="font-mono text-[11px] text-blue-400">Aktif (FIDO2)</span>
              </div>
            </div>
          </div>

          {/* Sertifikasi Profesi */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-[#24272A]">
              <Award className="w-4 h-4 text-amber-400" />
              Sertifikasi & Kualifikasi Keinsinyuran
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-[#E1E4E6]">ISO 18436-2 Vibration Analyst Cat III</span>
                  <span className="text-[10px] font-mono text-green-400">Berlaku s/d 2028</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                  Analisis spektrum FFT lanjutan, fase lintas kanal, dan modal test mesin turbin.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-[#E1E4E6]">Certified Reliability Leader (CRL)</span>
                  <span className="text-[10px] font-mono text-green-400">Aktif</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                  Manajemen siklus hidup aset industri (Asset Life Cycle & RCM).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-[#E1E4E6]">Siemens S7 & OPC-UA Architecture</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-[#8A929B]">Tersertifikasi</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                  Integrasi telemetri PLC ke broker MQTT gateway MIND-4.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-4 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] block">
              Tindakan Cepat Akun
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] text-xs font-medium text-slate-900 dark:text-[#E1E4E6] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                Edit Profil
              </button>
              <button
                onClick={onLogout}
                className="p-2 rounded bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] hover:bg-red-500/15 text-xs font-medium text-slate-500 dark:text-[#8A929B] hover:text-red-400 hover:border-red-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar Akun
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={onUpdateUser}
      />
    </div>
  );
};
