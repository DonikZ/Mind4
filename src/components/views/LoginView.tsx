import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Server,
  KeyRound,
  UserPlus,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { registerUser, getUserByEmail } from '../../data/mockUser';

interface LoginViewProps {
  onLoginSuccess: (userProfile?: Partial<UserProfile>) => void;
  currentUser?: UserProfile;
  isAlreadyAuthenticated?: boolean;
  onBackToDashboard?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  currentUser,
  isAlreadyAuthenticated,
  onBackToDashboard,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Silakan masukkan alamat email atau ID operator.');
      return;
    }
    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      if (isRegisterMode) {
        try {
          const newUser = registerUser(email.trim());
          onLoginSuccess(newUser);
        } catch (err: any) {
          setErrorMessage(err.message || 'Gagal mendaftar.');
        }
      } else {
        const existingUser = getUserByEmail(email.trim());
        if (existingUser) {
          onLoginSuccess(existingUser);
        } else {
          setErrorMessage('Akun belum terdaftar. Silakan daftar terlebih dahulu.');
        }
      }
    }, 800);
  };

  return (
    <div
      id="login-view"
      className="min-h-screen bg-slate-50 dark:bg-[#0B0C0D] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none"
    >
      {/* Background Ambient Industrial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar Navigation back to dashboard if already authenticated */}
      {onBackToDashboard && (
        <div className="absolute top-6 left-6 z-20">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] text-xs text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </button>
        </div>
      )}

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10 space-y-2">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] shadow-xs mb-2">
          <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center text-white font-mono font-bold text-xs">
            M
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
            MIND-4
          </span>
          <span className="text-[10px] text-blue-400 font-mono font-medium">
            v4.12
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
          Industrial Predictive Maintenance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8A929B] max-w-md mx-auto">
          Gerbang akses telemetri SCADA terpadu, deteksi anomali AI, dan kendali keandalan aset manufaktur
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-xl shadow-2xl p-6 sm:p-8 relative z-10 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-[#E1E4E6]">
            {isRegisterMode ? 'Registrasi Teknisi' : 'Masuk ke Sistem'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-1">
            {isRegisterMode 
              ? 'Daftarkan email baru untuk mendapatkan akses platform.'
              : 'Gunakan kredensial resmi operator pabrik Anda untuk melanjutkan'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              Email atau ID Karyawan
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@plant-a.m4.ind"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                Kata Sandi SCADA
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] transition-colors p-0.5 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {!isRegisterMode && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-500 dark:text-[#8A929B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-200 dark:border-[#24272A] text-blue-600 focus:ring-0 bg-white dark:bg-[#0F1113]"
                />
                <span>Ingat sesi di perangkat ini</span>
              </label>
              <span className="text-slate-400 dark:text-[#4B5259] font-mono text-[11px]">
                FIDO2 Ready
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            id="submit-login-btn"
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isRegisterMode ? 'Mendaftarkan Akun...' : 'Memverifikasi...'}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>{isRegisterMode ? 'Daftar Sekarang' : 'Masuk ke Platform'}</span>
                {isRegisterMode ? <UserPlus className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </span>
            )}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="pt-4 border-t border-slate-200 dark:border-[#24272A] text-center text-xs text-slate-500 dark:text-[#8A929B]">
          {isRegisterMode ? (
            <p>
              Sudah memiliki akun?{' '}
              <button 
                type="button" 
                onClick={() => { setIsRegisterMode(false); setErrorMessage(null); }} 
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Masuk di sini
              </button>
            </p>
          ) : (
            <p>
              Belum terdaftar?{' '}
              <button 
                type="button" 
                onClick={() => { setIsRegisterMode(true); setErrorMessage(null); }} 
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Daftar sebagai teknisi baru
              </button>
            </p>
          )}
        </div>

        {/* Security Badges */}
        <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-[#4B5259]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            ISO 27001 Security
          </span>
          <span className="flex items-center gap-1">
            <Server className="w-3 h-3 text-blue-400" />
            Gateway: Plant-A.Node1
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-400 dark:text-[#4B5259] space-y-1 relative z-10">
        <p>© 2026 MIND-4 Industrial Telemetry Systems. All rights reserved.</p>
        <p>Akses terbatas bagi personel yang memiliki otorisasi operasional pabrik.</p>
      </div>
    </div>
  );
};
