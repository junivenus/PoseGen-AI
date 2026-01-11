
import React from 'react';
import { PresetPose } from '../types';

interface PosePresetsProps {
  onSelect: (pose: string) => void;
  disabled: boolean;
  selectedPose: string | null;
}

const PosePresets: React.FC<PosePresetsProps> = ({ onSelect, disabled, selectedPose }) => {
  const presets = [
    { id: PresetPose.JUMPING, icon: 'fa-person-falling', label: 'JUMP' },
    { id: PresetPose.SITTING, icon: 'fa-chair', label: 'SIT' },
    { id: PresetPose.RUNNING, icon: 'fa-person-running', label: 'RUN' },
    { id: PresetPose.WAVING, icon: 'fa-hand-peace', label: 'WAVE' },
    { id: PresetPose.DANCING, icon: 'fa-music', label: 'DANCE' },
    { id: PresetPose.PROFILE, icon: 'fa-user', label: 'PROFILE' },
    { id: PresetPose.WIDE_SHOT, icon: 'fa-panorama', label: 'WIDE' },
    { id: PresetPose.CLOSE_UP, icon: 'fa-magnifying-glass-plus', label: 'ZOOM' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset.id)}
          disabled={disabled}
          className={`
            flex flex-col items-center justify-center p-2 border-2 transition-all cyber-font relative overflow-hidden group
            ${selectedPose === preset.id 
              ? 'bg-cyan-500/30 border-cyan-400 text-white shadow-[0_0_15px_#00f3ff]' 
              : 'bg-black/60 border-gray-700 text-gray-100 hover:border-magenta-500 hover:text-white'
            }
            ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {/* Subtle background glow on hover or active */}
          <div className={`absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity`}></div>
          
          <i className={`fas ${preset.icon} mb-1 text-sm ${selectedPose === preset.id ? 'text-cyan-300' : 'text-magenta-400'}`}></i>
          <span className={`text-[10px] font-black tracking-tighter ${selectedPose === preset.id ? 'text-white' : 'text-gray-100'}`}>{preset.label}</span>
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-current"></div>
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-current"></div>
        </button>
      ))}
    </div>
  );
};

export default PosePresets;
