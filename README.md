Bookmanager for abstrabit assignment

What this repo contains
- Next.js 
- Supabase for auth, storage and realtime postgres events

The main problem I had:

The syncing problem 
- when you added a bookmark it did not appear immediately in other tabs or devices.
- cause: the UI was not being updated reliably after the POST and cross-tab/device propagation was missing.
- Fix: write happens first, then the UI is notified immediately; cross-tab sync via BroadcastChannel; cross-device sync via Supabase Realtime; incoming events are deduplicated before updating the list.

How to run:
Set these environment variables in a .env.local file or your dev environment:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

```bash
npm install
npm run dev
```
