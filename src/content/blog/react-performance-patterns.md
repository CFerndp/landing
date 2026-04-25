---
title: "React Performance Patterns I Use in Production"
description: "A practical guide to the React performance techniques I apply daily: memoization, code splitting, virtualization and more."
pubDate: 2026-04-25
tags: ["React", "Performance", "TypeScript", "Frontend"]
category: tech
minutesRead: 8
---

React applications have a way of starting fast and becoming slow. It happens gradually: a few extra re-renders here, a heavy computation on every keystroke there, a list that grows to thousands of items over time. Then one day a user files a ticket saying the dashboard "feels laggy," and you start digging.

Over the years I've accumulated a set of patterns I reach for consistently in production codebases. None of them are magic — they all come with trade-offs — but knowing when and how to apply them makes the difference between a snappy UI and one that fights you on every interaction.

## 1. Memoization Done Right

`React.memo`, `useMemo`, and `useCallback` are the most misused performance tools in the React ecosystem. Developers often sprinkle them everywhere "just in case," which ironically adds overhead without any benefit. The rule I follow: **memoize when you have a measured problem, not a theoretical one.**

That said, there are clear cases where memoization pays off immediately.

### React.memo for expensive child components

```tsx
interface UserCardProps {
  user: User;
  onSelect: (id: string) => void;
}

const UserCard = React.memo(({ user, onSelect }: UserCardProps) => {
  return (
    <div className="user-card" onClick={() => onSelect(user.id)}>
      <Avatar src={user.avatar} />
      <span>{user.name}</span>
    </div>
  );
});
```

Without `React.memo`, every parent re-render re-renders every `UserCard` — even if the `user` prop hasn't changed. In a list of 50 users this is felt immediately.

### useCallback to stabilize handler references

The trap here is passing an inline function to a memoized child, which defeats the memo entirely:

```tsx
// ❌ Creates a new function reference on every render
<UserCard user={user} onSelect={(id) => handleSelect(id)} />

// ✅ Stable reference — UserCard.memo comparison passes
const handleSelect = useCallback((id: string) => {
  setSelected(id);
}, []);

<UserCard user={user} onSelect={handleSelect} />
```

### useMemo for derived expensive computations

```tsx
const sortedAndFilteredUsers = useMemo(() => {
  return users
    .filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
}, [users, query]);
```

If `users` has thousands of entries and this runs on every keystroke without memoization, you'll see dropped frames. With `useMemo`, the computation only re-runs when `users` or `query` actually changes.

## 2. Code Splitting with lazy + Suspense

The single biggest performance win available to most React apps is simply not shipping code the user hasn't asked for yet. Route-level code splitting is the low-hanging fruit.

### Route-level splitting

```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings  = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings"  element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

Each route becomes its own JS chunk. Users on `/dashboard` never download the Analytics or Settings code until they navigate there. In a large application this can cut the initial bundle by 60–70%.

### Component-level splitting for heavy UI

Sometimes a single route contains a component so heavy it's worth splitting on its own — rich text editors, chart libraries, or map widgets are common examples.

```tsx
const RichEditor = lazy(() => import('./components/RichEditor'));

function PostEditor({ post }: { post: Post }) {
  const [editorVisible, setEditorVisible] = useState(false);

  return (
    <div>
      <PostPreview post={post} />
      <button onClick={() => setEditorVisible(true)}>Edit</button>

      {editorVisible && (
        <Suspense fallback={<EditorSkeleton />}>
          <RichEditor initialValue={post.content} />
        </Suspense>
      )}
    </div>
  );
}
```

The editor bundle only downloads when the user actually clicks "Edit." For read-heavy interfaces this is a significant saving.

### Preloading critical routes

If you know a user is very likely to navigate somewhere next, you can preload proactively on hover:

```tsx
const loadDashboard = () => import('./pages/Dashboard');

// Preload on link hover — by the time they click, it's already cached
<Link
  to="/dashboard"
  onMouseEnter={loadDashboard}
  onFocus={loadDashboard}
>
  Dashboard
</Link>
```

## 3. List Virtualization

Rendering a list of 5,000 DOM nodes is expensive — even if those nodes are simple. The browser has to lay out and paint all of them, and React has to reconcile all of them on every state change. Virtualization solves this by only rendering the items currently visible in the viewport.

I use [`@tanstack/react-virtual`](https://tanstack.com/virtual) in most projects because it's headless and composes cleanly with custom scroll containers.

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface VirtualListProps<T> {
  items: T[];
  estimateSize: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function VirtualList<T>({ items, estimateSize, renderItem }: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5, // render 5 extra items above/below viewport
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflowY: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

Usage becomes straightforward:

```tsx
<VirtualList
  items={transactions}
  estimateSize={72}
  renderItem={(tx) => <TransactionRow transaction={tx} />}
/>
```

Even with 50,000 items in the array, only ~15 DOM nodes exist at any given time. Scroll performance stays smooth because the DOM stays small.

> **When to reach for virtualization:** Once a list reliably exceeds 200–300 items, virtualization becomes worth the complexity. Below that, pagination or infinite scroll with modest page sizes usually suffices.

## 4. Profiling Before Optimizing

Every technique above has a cost: added complexity, harder-to-read code, potential stale closure bugs with `useCallback`, bundle splitting edge cases. Applying them without evidence is a net negative.

The React DevTools Profiler is your first stop. Open DevTools → Profiler tab, enable "Record why each component rendered," then interact with the slow part of your UI.

What to look for:

- **Components rendering too often** — a parent state change causing 40 child re-renders when only 2 data items changed. This is where `React.memo` and `useCallback` pay off.
- **Long render durations** — a single component taking 80ms to render. Investigate whether it's doing heavy computation (candidate for `useMemo`) or has a deeply nested tree (candidate for component splitting).
- **Cascading renders** — state that lives too high in the tree, triggering re-renders far from where it's actually consumed. The fix is usually moving state down or using `useContext` + `useMemo` more surgically.

For frame-rate issues that don't show up clearly in the Profiler, the browser Performance panel is invaluable. Record a session, look for long tasks (>50ms) on the main thread, and trace them back to JavaScript call stacks.

```tsx
// Quick and dirty render counter during development
function useRenderCount(label: string) {
  const count = useRef(0);
  count.current++;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${label}] render #${count.current}`);
  }
}

// Drop this inside any component you suspect is over-rendering
function UserList({ users }: { users: User[] }) {
  useRenderCount('UserList');
  // ...
}
```

This simple hook has saved me hours of Profiler time when I just want to confirm a suspicion quickly before doing a proper investigation.

---

Performance work is fundamentally about measurement and trade-offs. The patterns here — memoization, code splitting, virtualization, and profiling — cover the majority of production performance issues I've encountered. Start with the Profiler, identify the real bottleneck, then apply the appropriate tool. The result is almost always a faster app and code that's no more complex than it needs to be.
