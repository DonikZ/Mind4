// Tambahkan helper function ini di atas komponen (sebelum "export const LiveMonitoringView")

interface SensorStatusResult {
  label: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

function getSensorStatus(value: number, min: number, max: number): SensorStatusResult {
  const isNormal = value >= min && value <= max;

  if (isNormal) {
    return {
      label: 'Normal',
      colorClass: 'text-green-400',
      borderClass: 'border-green-500/25',
      bgClass: 'bg-green-500/10',
    };
  }

  return {
    label: 'Exceeded',
    colorClass: 'text-red-400',
    borderClass: 'border-red-500/25',
    bgClass: 'bg-red-500/15',
  };
}

// =====================================================
// Lalu di dalam JSX, ganti tiap blok sensor jadi seperti ini:
// (Contoh untuk Vibration, terapkan pola yang sama ke sensor lain)
// =====================================================

{(() => {
  const vibStatus = getSensorStatus(latest.vibration, 1.5, 4.5);
  const isExceeded = vibStatus.label === 'Exceeded';

  return (
    <div
      className={`p-3 rounded-lg border flex items-center justify-between ${
        isExceeded
          ? 'border-red-900/40 bg-red-950/20'
          : 'border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113]'
      }`}
    >
      <div>
        <span className="text-xs text-slate-500 dark:text-[#8A929B] block">RMS Vibration</span>
        <span className={`text-lg font-bold font-mono ${isExceeded ? 'text-red-400' : 'text-slate-900 dark:text-[#E1E4E6]'}`}>
          {latest.vibration} mm/s
        </span>
        <span className="text-[10px] text-slate-400 dark:text-[#4B5259] block font-mono">
          Range: 1.5–4.5 mm/s
        </span>
      </div>
      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${vibStatus.bgClass} ${vibStatus.colorClass} border ${vibStatus.borderClass}`}>
        {vibStatus.label}
      </span>
    </div>
  );
})()}
