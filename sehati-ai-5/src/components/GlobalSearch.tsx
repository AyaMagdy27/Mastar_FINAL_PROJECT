import React, { useState, useEffect, useRef } from 'react';
import { Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('medcore_patients');
    if (saved) {
      setPatients(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPatients = query.trim() === '' ? [] : patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase()) ||
      (p.nationalId && p.nationalId.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-accent/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all focus:bg-background shadow-sm"
        placeholder="Search patient ID, name..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (query.trim() !== '') setIsOpen(true);
          // Refresh patients on focus just in case newly added
          const saved = localStorage.getItem('medcore_patients');
          if (saved) setPatients(JSON.parse(saved));
        }}
      />

      <AnimatePresence>
        {isOpen && query.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 lg:w-[300px] mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {filteredPatients.length > 0 ? (
              <div className="max-h-80 overflow-y-auto w-full py-2">
                <div className="px-3 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border mb-1">
                  Patients ({filteredPatients.length})
                </div>
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                      navigate(`/dashboard/patients/${patient.id}`);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted flex items-center gap-3 transition-colors"
                  >
                    <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{patient.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{patient.id} • {patient.gender}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No patients found matching "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
