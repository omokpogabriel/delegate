const PATHS: Record<string, string[]> = {
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  doc: ["M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z", "M14 3v6h6M8 13h8M8 17h5"],
  play: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M10 8.5l5.5 3.5-5.5 3.5z"],
  clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7v5l3 2"],
  book: ["M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z", "M4 19V5M19 19v2H6"],
  flag: ["M5 21V4M5 4h11l-2 4 2 4H5"],
  chev: ["M6 9l6 6 6-6"],
  left: ["M15 6l-6 6 6 6"],
  right: ["M9 6l6 6-6 6"],
  moon: ["M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"],
  sun: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"],
  hammer: ["M14 6l4 4M3 21l9-9M12.5 4.5l7 7-2 2-7-7z"],
  ship: ["M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7z", "M9 12l2 2 4-4"],
  log: ["M12 9v4M12 17h.01", "M10.3 3.9L2.5 17.5A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"],
  globe: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"],
  quiz: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"],
  pen: ["M4 20h4L19 9l-4-4L4 16z", "M13.5 6.5l4 4"],
  link: ["M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"],
  cloud: ["M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.6 1.5A3.5 3.5 0 0 1 17.5 18z"],
  devices: ["M3 5h13v9H3z", "M1 18h17M19 8h4v11h-4z"],
  x: ["M6 6l12 12M18 6L6 18"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M20 20l-4-4"],
  download: ["M12 4v11M7 10l5 5 5-5", "M5 20h14"],
  upload: ["M12 20V9M7 14l5-5 5 5", "M5 4h14"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21a8 8 0 0 1 16 0"],
};

export function Icon({ name, className = "i", size }: { name: keyof typeof PATHS | string; className?: string; size?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" style={size ? { width: size, height: size } : undefined}>
      {(PATHS[name] ?? []).map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export function Check() {
  return <span className="check" aria-hidden="true"><Icon name="check" /></span>;
}
