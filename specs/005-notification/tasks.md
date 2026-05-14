## 🔔 Global Announcement Banner (Notification Process)

### Goal

Implement a **global announcement banner** that displays a single important notification to all users.
This banner is **read-only**, manually controlled via the database, and appears **below the hero section**.

---

### Scope & Rules

* Only **ONE announcement** exists at any time.
* Announcements are **manually added and deleted** from Neon DB.
* Users **cannot** create, edit, comment, or react to announcements.
* No authentication is required.
* No scheduling or history tracking.
* No push notifications (UI-only banner).

---

### Database

* Use an `announcements` table with the following fields:

  * `id`
  * `title`
  * `message`
  * `type` → (`info`, `warning`, `success`)
  * `link` (optional)

* Backend fetches **only one record**:

  * Latest or first row (`LIMIT 1`).

---

### Backend Tasks

* Create a **read-only API endpoint**:

  * `GET /api/announcement`
* This endpoint:

  * Fetches one announcement from DB
  * Returns `null` if no announcement exists
* No POST / PUT / DELETE endpoints are needed (manual DB control only).

---

### Frontend Tasks

* Fetch announcement **once** on page load.
* If response is `null` → do nothing.
* If announcement exists:

  * Render a banner **below the hero section**
  * Use colors based on `type`:

    * `info` → blue
    * `warning` → yellow/orange
    * `success` → green
  * Show:

    * Notification icon
    * Title
    * Message
    * Optional link (if provided)

---

### UI / UX Requirements

* Banner must:

  * Look **modern and military-inspired**
  * Match army-style color identity
  * Be responsive (mobile-first)
* No input fields
* No “Add announcement” or “Add answer” buttons
* No dismiss button (optional later)

---

### Performance & Caching

* Cache announcement response (memory or framework cache).
* Revalidate on page reload only.
* No polling or real-time updates required.

---

### Error Handling

* If API fails:

  * Fail silently (do not block page)
  * Do not show error messages to user

---

### Explicit Non-Goals ❌

* ❌ No notification history
* ❌ No per-user targeting
* ❌ No admin dashboard
* ❌ No animations beyond simple fade/slide
* ❌ No user interaction

---

