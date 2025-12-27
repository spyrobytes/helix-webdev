# Services Page Components

## Structure

```
src/
├── app/services/
│   ├── page.tsx           # Page composition
│   └── page.module.css    # Page layout
└── components/services/
    ├── ServiceHero/       # Hero section with animated stats
    ├── ServiceDetail/     # Individual service cards (×6)
    ├── AIShowcase/        # End-to-end AI timeline
    └── ServicesCTA/       # Call-to-action section
```

## Components

### ServiceHero
Hero section with animated number counters.

**Features:**
- Animated stats: 6 → Core Disciplines, 50+ → Technologies, 100% → In-House
- Count-up animation using `requestAnimationFrame` with ease-out cubic
- Triggers once on page load (100ms delay)

**Customizing stats:**
```tsx
<AnimatedStat
  endValue={50}      // Target number
  suffix="+"         // Optional suffix (+, %, etc.)
  duration={2000}    // Animation duration in ms
  isVisible={true}   // Trigger animation
/>
```

---

### ServiceDetail
Expandable service cards with scroll-triggered reveals.

**Props:**
```tsx
interface ServiceDetailProps {
  service: Service;    // From @/constants/data.ts
  index: number;       // For accent color rotation
  isReversed: boolean; // Alternates layout (left/right)
}
```

**Features:**
- IntersectionObserver triggers at 15% visibility
- Alternating layout via `isReversed` prop
- 6 accent colors rotate based on index
- Staggered capability list animations

**Accent color rotation:**
```ts
const accentColors = [
  'var(--accent-1)', // cyan
  'var(--accent-2)', // purple
  'var(--accent-3)', // green
  'var(--accent-5)', // pink
  'var(--accent-6)', // blue
  'var(--accent-4)', // orange
];
```

---

### AIShowcase
Interactive timeline with reversible scroll progress.

**Features:**
- 5-stage timeline with alternating left/right layout
- Progress bar tracks scroll position (reversible)
- Nodes glow when active, dim when scrolled past
- Stage content stays visible once revealed

**Key state:**
```tsx
const [highestVisibleIndex, setHighestVisibleIndex] = useState(-1);
// -1 = none visible, 0-4 = current progress

const progressPercent = ((highestVisibleIndex + 1) / 5) * 100;
```

**Adding/modifying stages:**
Edit `AI_STAGES` array in component:
```tsx
const AI_STAGES = [
  {
    id: 'discover',
    number: '01',
    title: 'Discover & Analyze',
    description: '...',
    icon: 'M21 21l-6-6m2-5a7...', // SVG path
    accent: 'var(--accent-1)',
  },
  // ...
];
```

---

### ServicesCTA
Call-to-action with gradient background and decorative blurs.

**Links to:**
- `/contact` - Primary CTA
- `/approach` - Secondary CTA

---

## Animation Patterns

### Scroll-Triggered Reveal
Standard pattern used across components:
```tsx
const [isVisible, setIsVisible] = useState(false);
const sectionRef = useRef<HTMLElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target); // One-time trigger
      }
    },
    { threshold: 0.15 }
  );
  observer.observe(sectionRef.current);
  return () => observer.disconnect();
}, []);
```

### Animated Counter
```tsx
function animate(currentTime: number) {
  const progress = Math.min((currentTime - startTime) / duration, 1);
  const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
  setDisplayValue(Math.round(endValue * easeOut));
  if (progress < 1) requestAnimationFrame(animate);
}
```

---

## CSS Patterns

### CSS Variables Used
```css
--accent-1 through --accent-6  /* Accent colors */
--text-main, --text-muted      /* Text colors */
--border-subtle                /* Border color */
--max-width: 1200px            /* Container width */
```

### Responsive Breakpoints
- Mobile: `max-width: 767px`
- Tablet: `min-width: 768px`
- Desktop: `min-width: 900px`

### Reduced Motion
All components respect `prefers-reduced-motion: reduce`.

---

## Data Source

Services data from `@/constants/data.ts`:
```tsx
import { SERVICES } from '@/constants/data';
// Returns: Service[] with id, icon, title, description, tags, backItems, etc.
```

## Adding a New Service

1. Add to `SERVICES` array in `src/constants/data.ts`
2. Add icon path to `SERVICE_ICONS` if needed
3. Component automatically renders new service
