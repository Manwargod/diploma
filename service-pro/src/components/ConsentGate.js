import React from 'react';

const ConsentGate = ({ checked, onChange, text, policyLabel, policyUrl, isDark }) => {
  return (
    <label className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-black/5 border-black/10 text-black/80'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1"
      />
      <span>
        {text}{' '}
        {policyUrl ? (
          <a href={policyUrl} target="_blank" rel="noreferrer" className="underline text-[#00f2ff] font-bold">
            {policyLabel}
          </a>
        ) : (
          <span className="underline text-[#00f2ff] font-bold">{policyLabel}</span>
        )}
      </span>
    </label>
  );
};

export default ConsentGate;
