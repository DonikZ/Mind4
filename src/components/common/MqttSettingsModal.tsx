import React, { useState } from 'react';
import { X, Network, Save, Wifi, WifiOff } from 'lucide-react';
import { MqttConfig } from '../../services/mqttService';

interface MqttSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MqttConfig;
  onSave: (config: MqttConfig) => void;
  isConnected: boolean;
}

export const MqttSettingsModal: React.FC<MqttSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  isConnected
}) => {
  const [url, setUrl] = useState(config.url);
  const [topic, setTopic] = useState(config.topic);
  const [username, setUsername] = useState(config.username || '');
  const [password, setPassword] = useState(config.password || '');

  React.useEffect(() => {
    if (isOpen) {
      setUrl(config.url);
      setTopic(config.topic);
      setUsername(config.username || '');
      setPassword(config.password || '');
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#24272A]">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-[#E1E4E6]">Koneksi MQTT (Industrial IoT)</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-md bg-slate-50 dark:bg-[#0B0C0D] border border-slate-200 dark:border-[#24272A]">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-emerald-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs font-medium text-slate-900 dark:text-[#E1E4E6]">
              Status: {isConnected ? 'Terhubung ke broker' : 'Belum terhubung ke broker'}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B]">Broker WebSocket URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="wss://broker.emqx.io:8084/mqtt"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0C0D] border border-slate-200 dark:border-[#24272A] rounded-md text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B]">Topic Utama</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="factory/machines/+/telemetry"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0C0D] border border-slate-200 dark:border-[#24272A] rounded-md text-xs text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B]">Username (Opsional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0C0D] border border-slate-200 dark:border-[#24272A] rounded-md text-xs text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#8A929B]">Password (Opsional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0C0D] border border-slate-200 dark:border-[#24272A] rounded-md text-xs text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-[#24272A] bg-slate-50 dark:bg-[#0F1113] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-medium text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onSave({ url, topic, username, password });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Terapkan & Hubungkan
          </button>
        </div>
      </div>
    </div>
  );
};
