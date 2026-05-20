## Fix: /admin redirects to home

### Root cause
`Admin.tsx` calls `supabase.auth.getUser()` directly in a `useEffect` on mount. If the session hasn't finished hydrating from localStorage yet, `getUser()` resolves with `null` → the page immediately navigates to `/`. This is the classic "check role before auth loads" race condition.

### Fix
Replace the standalone `supabase.auth.getUser()` check with the existing `useAuth()` context, which already exposes `user` and `loading`. Wait for `loading` to be `false` before deciding.

```text
const { user, loading } = useAuth();

useEffect(() => {
  if (loading) return;              // wait for auth hydration
  if (!user) { navigate('/auth'); return; }       // not logged in → /auth
  if (user.email !== ADMIN_EMAIL) { navigate('/'); return; }
  setIsAdmin(true);
  setLoading(false);
  fetchData();
}, [user, loading, navigate]);
```

Also: redirect non-logged-in users to `/auth` (not `/`) so it's obvious they need to log in.

### Verification
After fix, hit `/admin`:
- Not logged in → lands on `/auth`
- Logged in as `wilkinson.marshall@gmail.com` → dashboard loads
- Logged in as anyone else → bounced to `/`

No other files change. Confirm and I'll patch it.