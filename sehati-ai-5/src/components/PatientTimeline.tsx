import React from 'react';
import { Calendar, Stethoscope, Pill, FlaskConical, BrainCircuit } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'visit' | 'diagnosis' | 'prescription' | 'lab_result';
  title: string;
  description: string;
  doctor?: string;
  details?: Record<string, string>;
}

export function PatientTimeline({ events }: { events: TimelineEvent[] }) {
  // Sort events chronologically (newest first)
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="relative border-l-2 border-border pl-6 ml-3 space-y-8 my-6">
      {sortedEvents.map((event) => {
        let Icon = Calendar;
        let iconBg = 'bg-primary';
        let iconColor = 'text-primary-foreground';
        let badgeStyle = 'bg-primary/10 text-primary';
        
        switch (event.type) {
          case 'visit':
            Icon = Stethoscope;
            iconBg = 'bg-primary';
            iconColor = 'text-primary-foreground';
            badgeStyle = 'bg-primary/10 text-primary';
            break;
          case 'diagnosis':
            Icon = BrainCircuit;
            iconBg = 'bg-amber-500';
            iconColor = 'text-white';
            badgeStyle = 'bg-amber-500/10 text-amber-600';
            break;
          case 'prescription':
            Icon = Pill;
            iconBg = 'bg-emerald-500';
            iconColor = 'text-white';
            badgeStyle = 'bg-emerald-500/10 text-emerald-600';
            break;
          case 'lab_result':
            Icon = FlaskConical;
            iconBg = 'bg-accent';
            iconColor = 'text-accent-foreground';
            badgeStyle = 'bg-accent/10 text-accent';
            break;
        }

        return (
          <div key={event.id} className="relative group">
            {/* Timeline Marker */}
            <div className={`absolute -left-[41px] top-1 w-8 h-8 rounded-full border-[3px] border-background flex items-center justify-center ${iconBg} ${iconColor} z-10 shadow-sm ring-1 ring-border group-hover:scale-110 transition-transform`}>
              <Icon className="w-4 h-4" />
            </div>
            
            {/* Event Card */}
            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                 <div>
                   <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                     {event.title}
                     <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${badgeStyle}`}>
                       {event.type.replace('_', ' ')}
                     </span>
                   </h4>
                   <p className="text-xs text-muted-foreground mt-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> {event.date}</p>
                 </div>
                 {event.doctor && (
                   <span className="text-[11px] font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-md flex items-center shrink-0">
                     <Stethoscope className="w-3.5 h-3.5 mr-1.5" />
                     {event.doctor}
                   </span>
                 )}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{event.description}</p>
              
              {event.details && (
                 <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-2">
                   {Object.entries(event.details).map(([k, v]) => (
                     <div key={k}>
                       <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">{k}</span>
                       <span className="text-xs font-medium text-foreground">{v}</span>
                     </div>
                   ))}
                 </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  );
}
