const paths: Record<string, string> = {
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z M8 7h7",
  access: "M12 5.5a1.5 1.5 0 1 0 .01 0 M5 9l7 1.5L19 9 M12 10.5V15 M9 21l3-6 3 6",
  dollar: "M12 3v18 M16 7.5c-.7-1-2-1.5-4-1.5-2.2 0-4 1-4 2.7 0 4 8 1.8 8 5.6 0 1.7-1.8 2.7-4 2.7-2 0-3.5-.6-4.2-1.8",
  food: "M12 8c-3-3-8-1-8 4 0 4 3 8 5 8 1.2 0 1.5-.6 3-.6s1.8.6 3 .6c2 0 5-4 5-8 0-5-5-7-8-4z M12 8c0-2 1-4 3-5",
  home: "M3 11l9-8 9 8 M5 10v10h5v-6h4v6h5V10",
  work: "M3 8h18v12H3z M9 8V5h6v3 M3 13h18",
  heart: "M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  people: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M16 11a2.5 2.5 0 1 0 0-5 M17 14.2c2.2.4 4 2.3 4 5.8",
  building: "M5 21V4h9v17 M14 9h5v12 M9 8h1 M9 12h1 M9 16h1 M3 21h18",
  fitness: "M6 7v10 M3 10v4 M18 7v10 M21 10v4 M6 12h12",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  arrow: "M5 12h14 M13 6l6 6-6 6"
};
export const categoryIcon: Record<string, string> = {
  "Academic support": "book", Accessibility: "access", "Financial aid": "dollar", "Food & essentials": "food",
  Housing: "home", "Jobs & careers": "work", Wellbeing: "heart", "Student support": "people", "Campus services": "building", "Fitness & recreation": "fitness", Safety: "shield"
};
export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.spark} /></svg>;
}
