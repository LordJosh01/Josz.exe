/*
# Create core tables for Events by Belsh

## Overview
Creates four tables to persist data that is currently lost or only in localStorage:
1. enquiries — contact form submissions from the Contact page
2. memories — Memory Wall posts (public, shared across all visitors)
3. rsvp_guests — RSVP guest lists from the Premium Features RSVP Manager
4. countdown_events — Event countdown timers from the Premium Features page

## Tables

### 1. enquiries
Stores contact form submissions from the Contact page.
- id (uuid, primary key)
- name (text, not null) — full name of the enquirer
- email (text, not null) — email address
- phone (text) — phone/WhatsApp number (optional)
- event_type (text, not null) — type of event (Wedding, Birthday, etc.)
- event_date (date) — proposed event date (optional)
- guest_count (text) — estimated guest count (optional, free text)
- budget_range (text) — selected budget range (optional)
- message (text, not null) — the enquiry message/vision
- status (text, default 'new') — tracking status: new, contacted, closed
- created_at (timestamptz, default now())

### 2. memories
Stores Memory Wall posts — public, shared across all site visitors.
- id (uuid, primary key)
- name (text, not null) — poster's name
- message (text, not null) — memory/message text
- photo (text) — base64 data URL of uploaded photo (optional)
- created_at (timestamptz, default now())

### 3. rsvp_guests
Stores RSVP guest entries from the RSVP Manager on the Premium Features page.
- id (uuid, primary key)
- name (text, not null) — guest name
- phone (text, not null) — guest phone number
- status (text, default 'pending') — pending, attending, declined
- meal (text, default '') — meal preference
- created_at (timestamptz, default now())

### 4. countdown_events
Stores event countdown timer entries from the Premium Features page.
- id (uuid, primary key)
- name (text, not null) — event name
- event_date (timestamptz, not null) — target date/time for countdown
- created_at (timestamptz, default now())

## Security
This is a single-tenant app with NO sign-in screen. All policies use
TO anon, authenticated so the anon-key frontend can read and write its own data.
- enquiries: anyone can insert (form submissions); only readable by anon/authenticated (shared).
- memories: full CRUD for anon + authenticated (public memory wall).
- rsvp_guests: full CRUD for anon + authenticated.
- countdown_events: full CRUD for anon + authenticated.

All tables have RLS enabled.
*/

-- 1. ENQUIRIES
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  event_type text NOT NULL,
  event_date date,
  guest_count text DEFAULT '',
  budget_range text DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_enquiries" ON enquiries;
CREATE POLICY "anon_select_enquiries" ON enquiries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries" ON enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_enquiries" ON enquiries;
CREATE POLICY "anon_update_enquiries" ON enquiries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_enquiries" ON enquiries;
CREATE POLICY "anon_delete_enquiries" ON enquiries FOR DELETE
  TO anon, authenticated USING (true);

-- 2. MEMORIES
CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  photo text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_memories" ON memories;
CREATE POLICY "anon_select_memories" ON memories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_memories" ON memories;
CREATE POLICY "anon_insert_memories" ON memories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_memories" ON memories;
CREATE POLICY "anon_update_memories" ON memories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_memories" ON memories;
CREATE POLICY "anon_delete_memories" ON memories FOR DELETE
  TO anon, authenticated USING (true);

-- 3. RSVP_GUESTS
CREATE TABLE IF NOT EXISTS rsvp_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  meal text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rsvp_guests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_rsvp" ON rsvp_guests;
CREATE POLICY "anon_select_rsvp" ON rsvp_guests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_rsvp" ON rsvp_guests;
CREATE POLICY "anon_insert_rsvp" ON rsvp_guests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_rsvp" ON rsvp_guests;
CREATE POLICY "anon_update_rsvp" ON rsvp_guests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_rsvp" ON rsvp_guests;
CREATE POLICY "anon_delete_rsvp" ON rsvp_guests FOR DELETE
  TO anon, authenticated USING (true);

-- 4. COUNTDOWN_EVENTS
CREATE TABLE IF NOT EXISTS countdown_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  event_date timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE countdown_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_countdown" ON countdown_events;
CREATE POLICY "anon_select_countdown" ON countdown_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_countdown" ON countdown_events;
CREATE POLICY "anon_insert_countdown" ON countdown_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_countdown" ON countdown_events;
CREATE POLICY "anon_update_countdown" ON countdown_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_countdown" ON countdown_events;
CREATE POLICY "anon_delete_countdown" ON countdown_events FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvp_guests_created_at ON rsvp_guests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_countdown_events_event_date ON countdown_events (event_date);