import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Check,
  User,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  Building2,
  FileText,
  Trash2,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [position, setPosition] = useState(user.position);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [department, setDepartment] = useState(user.department);
  const [bio, setBio] = useState(user.bio || '');

  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file selection and convert to Base64 Data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5MB.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    // Generate an SVG initials fallback avatar
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';
    const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="%231E293B"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="72" font-weight="bold" fill="%2360A5FA">${initials}</text></svg>`;
    setPhotoUrl(svg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setUploadError('Nama lengkap wajib diisi.');
      return;
    }
    if (!birthDate) {
      setUploadError('Tanggal lahir wajib diisi.');
      return;
    }
    if (!position.trim()) {
      setUploadError('Jabatan wajib diisi.');
      return;
    }

    const updated: UserProfile = {
      ...user,
      name: name.trim(),
      birthDate,
      position: position.trim(),
      photoUrl,
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      department: department.trim(),
      bio: bio.trim(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="edit-profile-modal"
        className="w-full max-w-2xl bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-[#E1E4E6] flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Edit Profil Pengguna
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
              Perbarui identitas, informasi personal, tanggal lahir, jabatan, dan foto profil Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {uploadError && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {uploadError}
            </div>
          )}

          {/* Section: Foto Profile */}
          <div className="p-4 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] space-y-4">
            <span className="text-xs font-semibold text-slate-900 dark:text-[#E1E4E6] uppercase tracking-wider block">
              Foto Profil
            </span>

            <div className="flex flex-wrap items-center gap-5">
              {/* Photo Preview */}
              <div className="relative group">
                <img
                  src={photoUrl}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/50 shadow-md bg-slate-100 dark:bg-[#1A1D1F]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] transition-opacity cursor-pointer"
                  title="Ganti Foto"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Ubah</span>
                </button>
              </div>

              {/* Upload & Action Buttons */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] hover:bg-slate-200 dark:hover:bg-[#24272A] text-xs font-semibold text-slate-900 dark:text-[#E1E4E6] transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    Unggah Gambar Baru
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] text-xs font-medium text-slate-500 dark:text-[#8A929B] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Gunakan Inisial
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                  Format PNG, JPG, GIF atau WebP (maks. 5MB). Foto ini ditampilkan pada audit log SCADA & kartu insinyur.
                </p>
              </div>
            </div>

            {/* Quick Preset Avatars */}
            <div>
              <span className="text-[11px] text-slate-500 dark:text-[#8A929B] block mb-2">
                Atau pilih avatar insinyur yang tersedia:
              </span>
              <div className="flex items-center gap-2.5">
                {PRESET_AVATARS.map((avatar, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setPhotoUrl(avatar)}
                    className={`relative rounded-full p-0.5 transition-all cursor-pointer ${
                      photoUrl === avatar
                        ? 'ring-2 ring-blue-500 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`Preset ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Main Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Nama Lengkap <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Ir. Danang Wicaksono, M.T."
                required
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Tanggal Lahir <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Jabatan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                Jabatan / Posisi <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Contoh: Lead Reliability Engineer"
                required
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Departemen */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Departemen / Unit Kerja
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Contoh: Predictive Maintenance Operations"
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Email Korporat
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@plant-a.m4.ind"
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Telepon */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+62 812-xxxx-xxxx"
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Bio / Catatan Spesialisasi */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Spesialisasi & Ringkasan Keahlian
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Jelaskan sertifikasi, keahlian mesin atau spesialisasi vibrasi..."
              className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-[#24272A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] text-xs font-medium text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
