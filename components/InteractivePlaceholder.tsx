import React, { useRef, useState, useEffect } from 'react';

interface EditableVariableProps {
  variableKey: string;
  value: string;
  guidance: string;
  examples: string[];
  onUpdate: (value: string) => void;
}

const EditableVariable: React.FC<EditableVariableProps> = ({
  variableKey,
  value,
  guidance,
  examples,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setInputValue(value || '');
  }, [open, value]);

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <span className="relative inline-block align-baseline">
      <button
        type="button"
        className={`px-1 py-0.5 rounded bg-sg-mint-green/40 border border-sg-mint-green text-sg-dark-teal font-semibold underline decoration-dotted cursor-pointer transition hover:bg-sg-mint-green/70 focus:outline-none focus:ring-2 focus:ring-sg-mint-green text-sm sm:text-base`}
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Edit ${variableKey}`}
      >
        {value ? <span className="font-bold">{value}</span> : `{{${variableKey}}}`}
      </button>
      {open && (
        <div
          ref={ref}
          className="z-50 absolute left-1/2 -translate-x-1/2 mt-2 w-80 max-w-[calc(100vw-2rem)] sm:min-w-[320px] bg-white border border-sg-mint-green rounded-xl shadow-xl p-3 sm:p-4 animate-fade-in"
          style={{ top: '2.2em' }}
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-2 text-sg-dark-teal font-bold text-sm sm:text-base">{variableKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
          <div className="mb-2 text-gray-700 text-xs sm:text-sm">{guidance}</div>
          <div className="mb-2 text-xs text-gray-500">
            <span className="font-semibold">Examples:</span>
            <ul className="list-disc ml-4 sm:ml-5 mt-1">
              {examples.map((ex, i) => (
                <li key={i} className="mb-0.5 text-xs sm:text-sm">{ex}</li>
              ))}
            </ul>
          </div>
          <input
            className="w-full border border-sg-mint-green rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sg-mint-green mb-2 text-sm sm:text-base"
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={variableKey.replace(/_/g, ' ')}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') { onUpdate(inputValue); setOpen(false); } }}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-2 sm:px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs sm:text-sm font-semibold"
              onClick={() => setOpen(false)}
              type="button"
            >Cancel</button>
            <button
              className="px-2 sm:px-3 py-1 rounded bg-sg-mint-green text-sg-dark-teal font-bold hover:bg-sg-mint-green/80 text-xs sm:text-sm"
              onClick={() => { onUpdate(inputValue); setOpen(false); }}
              type="button"
            >Update</button>
          </div>
        </div>
      )}
    </span>
  );
};

export default EditableVariable; 