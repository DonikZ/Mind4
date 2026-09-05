import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, RefreshCw, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Machine } from '../../types';
import { SensorLiveStreamChart, LiveSensorPoint } from '../charts/SensorLiveStreamChart';
import { SensorValueDisplay } from '../common/SensorValueDisplay';

interface LiveMonitoringViewProps {
  machines: Machine[];
  selectedMachine: Machine;
  onSelectMachine: (machine: Machine) => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([
    'vibration',
    'temperature',
  ]);
  const [telemetryHistory, setTelemetryHistory] = useState<LiveSensorPoint[]>([
    { time: '--:--', temperature: 0, vibration: 0, pressure: 0, rpm: 0, current: 0, power: 0 }
  ]);

  // Reset history when machine changes
  useEffect(() => {
    if (selectedMachine?.id) {
      setTelemetryHistory([
        { time: '--:--', temperature: 0, vibration: 0, pressure: 0, rpm: 0, current: 0, power: 0 }
      ]);
    }
  }, [selectedMachine?.id]);

  // Live simulation removed for production use.
  // We now rely on MQTT telemetry data.
  useEffect(() => {
    if (!isPlaying || !selectedMachine) return;

    // Listen to real MQTT telemetry using custom event or service if needed,
    // or we assume it's updated via props if App.tsx passes it.
    // In this component, we can listen directly to mqttService
    const handleMqttMessage = (topic: string, payload: any) => {
      // Expecting payload format: { machineId: string, sensors: { temperature, vibration, ... } }
      if (payload.machineId === selectedMachine.id && payload.sensors) {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        
        setTelemetryHistory((prev) => {
          const newPoint: LiveSensorPoint = {
            time: timeStr,
            temperature: payload.sensors.temperature || 0,
            vibration: payload.sensors.vibration || 0,
            pressure: payload.sensors.pressure || 0,
            rpm: payload.sensors.rpm || 0,
            current: payload.sensors.current || 0,
            power: payload.sensors.power || 0,
          };
          const updated = [...prev, newPoint];
          if (updated.length > 18) updated.shift();
          return updated;
        });
      }
    };

    let unsubscribe: (() => void) | undefined;

    import('../../services/mqttService').then(({ mqttService }) => {
      unsubscribe = mqttService.subscribeToMessages(handleMqttMessage);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isPlaying, selectedMachine?.id]);

  const latest = telemetryHistory[telemetryHistory.length - 1];

  if (!selectedMachine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-200">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-[#1A1D1F] flex items-center justify-center">
          <Activity className="w-8 h-8 text-slate-400 dark:text-[#4B5259]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-[#E1E4E6]">Tidak Ada Aset</h2>
        <p className="text-sm text-slate-500 dark:text-[#8A929B] mt-2 max-w-md text-center">
          Belum ada mesin yang tersedia untuk Live Monitoring. Hubungkan MQTT dan tunggu data masuk.
        </p>
      </div>
    );
  }

  return (
    <div id="live-monitoring-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
              Live Monitoring
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
            Synchronous high-speed streaming telemetry from plant sensor network
          </p>
        </div>

        {/* Global Connection & Streaming controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/25 text-xs font-semibold">
            <span>● LIVE</span>
            <span className="text-green-500/40">·</span>
            <span className="font-mono text-[11px]">Sampling: 1 sec</span>
            <span className="text-green-500/40">·</span>
            <span>Stable Link</span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] text-xs font-semibold text-slate-900 dark:text-[#E1E4E6] hover:bg-slate-200 dark:hover:bg-[#24272A] transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Stream' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Machine Switcher Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 dark:text-[#4B5259] uppercase tracking-wider shrink-0 mr-1">
          Active Machine:
        </span>
        {machines.map((m) => {
          const isSelected = selectedMachine.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMachine(m)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium font-mono flex items-center gap-2 transition-colors shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
              }`}
            >
              <span>{m.id}</span>
              <span className="font-sans text-[11px] opacity-75">{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Monitoring Section: Chart + Live Telemetry Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Large Live Chart */}
        <div className="lg:col-span-8 p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
                Multi-Sensor Waveform Telemetry
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#8A929B]">
                Asset: {selectedMachine.id} ({selectedMachine.name})
              </p>
            </div>

            {/* Sensor Selection Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['vibration', 'temperature', 'pressure', 'rpm', 'current', 'power'].map((sensor) => {
                const active = selectedSensors.includes(sensor);
                return (
                  <button
                    key={sensor}
                    onClick={() => {
                      if (active) {
                        if (selectedSensors.length > 1) {
                          setSelectedSensors(selectedSensors.filter((s) => s !== sensor));
                        }
                      } else {
                        setSelectedSensors([...selectedSensors, sensor]);
                      }
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
                    }`}
                  >
                    {sensor}
                  </button>
                );
              })}
            </div>
          </div>

          <SensorLiveStreamChart
            data={telemetryHistory}
            activeSensors={selectedSensors}
            height={300}
          />
        </div>

        {/* Live Telemetry Panel (Right Side) */}
        <div className="lg:col-span-4 p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
              Live Sensor Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8A929B] font-mono">
              Last packet: {latest.time}
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-[#8A929B] block">Temperature</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
                  {latest.temperature} °C
                </span>
                <span className="text-[10px] text-slate-400 dark:text-[#4B5259] block font-mono">
                  Range: 45–65 °C
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/25">
                Normal
              </span>
            </div>

            <div className="p-3 rounded-lg border border-red-900/40 bg-red-950/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-[#8A929B] block">RMS Vibration</span>
                <span className="text-lg font-bold font-mono text-red-400">
                  {latest.vibration} mm/s
                </span>
                <span className="text-[10px] text-slate-400 dark:text-[#4B5259] block font-mono">
                  Range: 1.5–4.5 mm/s
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
                Exceeded
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-[#8A929B] block">System Pressure</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
                  {latest.pressure} bar
                </span>
                <span className="text-[10px] text-slate-400 dark:text-[#4B5259] block font-mono">
                  Range: 5.5–7.2 bar
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/25">
                Normal
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-[#8A929B] block">Shaft RPM</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
                  {latest.rpm.toLocaleString()} rpm
                </span>
                <span className="text-[10px] text-slate-400 dark:text-[#4B5259] block font-mono">
                  Range: 1,600–2,000 rpm
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/25">
                Normal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
