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

interface SensorStatusResult {
  label: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  isExceeded: boolean;
}

function getSensorStatus(value: number, min: number, max: number): SensorStatusResult {
  const isNormal = value >= min && value <= max;

  if (isNormal) {
    return {
      label: 'Normal',
      colorClass: 'text-green-400',
      borderClass: 'border-green-500/25',
      bgClass: 'bg-green-500/10',
      isExceeded: false,
    };
  }

  return {
    label: 'Exceeded',
    colorClass: 'text-red-400',
    borderClass: 'border-red-500/25',
    bgClass: 'bg-red-500/15',
    isExceeded: true,
  };
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
}) => {
 const [isPlaying, setIsPlaying] = useState(true);
}