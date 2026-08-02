import { cn } from '@/utils/helpers';

/**
 * Subtle animated mesh gradient background for inner pages
 */
export default function GradientMesh({ className, opacity = 0.4 }) {
  return (
    <div 
      className={cn('absolute inset-0 z-0 overflow-hidden pointer-events-none', className)}
      style={{ opacity }}
    >
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/30 blur-[100px] mix-blend-screen animate-pulse-glow" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] mix-blend-screen animate-pulse-glow" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-secondary/20 blur-[90px] mix-blend-screen animate-pulse-glow" style={{ animationDuration: '10s', animationDelay: '4s' }} />
      
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPgogIDwvZmlsdGVyPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZUZpbHRlcikiIG9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20" />
    </div>
  );
}
