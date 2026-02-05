# 🏗️ Exercise Types - Aggregate Root Pattern

## 📋 Overview

This document explains the **Aggregate Root Pattern** implementation for Exercise Types in the sports performance tracking platform.

---

## 🎯 Core Concept

### The Aggregate Root Pattern

```
SuperAdmin (Platform Owner)
    └── Club (AGGREGATE ROOT) ⭐
         ├── ClubAdmins (employees who manage)
         ├── Coaches (employees who train)
         ├── Players (athletes being tracked)
         ├── PodHolders (hardware devices)
         ├── Pods (individual sensors)
         ├── ExerciseTypes (training/match activity definitions) ✅
         ├── Events (matches/training sessions)
         ├── Subscriptions (billing)
         └── HrZoneDefaults (team-wide settings)
```

**Key Principle**: Club OWNS all business data. Everything else either manages or uses that data.

---

## 🏋️ Why ExerciseType Belongs to Club

### Real-World Analogy

| Entity | Real-World Equivalent |
|--------|----------------------|
| **Club** | Company |
| **ExerciseType** | Standard Operating Procedure (SOP) |
| **ClubAdmin** | Employee |
| **PodHolder** | Machine/Equipment |

**Question**: Who owns the company's SOPs?
- ✅ **The Company** (Club)
- ❌ Not the Employee (Admin)
- ❌ Not the Machine (PodHolder)

### Business Rules

| Scenario | Result |
|----------|--------|
| Admin leaves company | ✅ Exercises remain (belong to club) |
| PodHolder breaks | ✅ Exercises remain (belong to club) |
| Club deleted | ❌ All exercises deleted (cascade) |

---

## 🔄 Data Access Patterns

### ✅ CORRECT Pattern

```typescript
// Admin accessing exercises
const admin = await prisma.clubAdmin.findUnique({
  where: { admin_id }
});

const exercises = await prisma.exerciseType.findMany({
  where: { club_id: admin.club_id }  // ← Access through club
});
```

```typescript
// PodHolder accessing exercises
const podHolder = await prisma.podHolder.findUnique({
  where: { pod_holder_id }
});

const exercises = await prisma.exerciseType.findMany({
  where: { club_id: podHolder.club_id }  // ← Access through club
});
```

### ❌ WRONG Patterns

```typescript
// ❌ DON'T: Query by admin_id
const exercises = await prisma.exerciseType.findMany({
  where: { admin_id }  // ← WRONG! Exercises don't belong to admin
});

// ❌ DON'T: Query by pod_holder_id
const exercises = await prisma.exerciseType.findMany({
  where: { pod_holder_id }  // ← WRONG! Exercises don't belong to hardware
});
```

---

## 🗄️ Database Schema

### Prisma Model

```prisma
model ExerciseType {
  exercise_type_id String   @id @default(uuid()) @db.Uuid
  club_id          String   @db.Uuid              // ← Foreign key to Club
  name             String
  event_type       String   @default("training")  // "training" | "match"
  is_system        Boolean  @default(false)       // true = default, false = custom
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  // Parent relation - Exercise belongs to Club (Aggregate Root)
  club Club @relation(fields: [club_id], references: [club_id], onDelete: Cascade)

  @@map("exercise_types")
}
```

### Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `club_id` | UUID | **Owner of the exercise** (Aggregate Root) |
| `is_system` | Boolean | `true` = Default (cannot delete), `false` = Custom |
| `event_type` | String | `"training"` or `"match"` |

---

## 🔌 API Endpoints

### 1. Create Exercise Type

```http
POST /exercise-types
Content-Type: application/json

{
  "name": "Sprint Drill",
  "event_type": "training",
  "club_id": "uuid-of-club"
}
```

**Response:**
```json
{
  "exercise_type_id": "uuid",
  "name": "Sprint Drill",
  "event_type": "training",
  "club_id": "uuid-of-club",
  "is_system": false,
  "created_at": "2026-02-04T...",
  "club": {
    "club_id": "uuid-of-club",
    "club_name": "Barcelona FC"
  }
}
```

### 2. Get All Exercises (Filtered by Club)

```http
GET /exercise-types?club_id=uuid-of-club
```

**Response:**
```json
[
  {
    "exercise_type_id": "uuid-1",
    "name": "Warm Up",
    "event_type": "training",
    "is_system": true,
    "club": {
      "club_id": "uuid-of-club",
      "club_name": "Barcelona FC"
    }
  },
  {
    "exercise_type_id": "uuid-2",
    "name": "Sprint Drill",
    "event_type": "training",
    "is_system": false,
    "club": { ... }
  }
]
```

### 3. Update Exercise Type

```http
PATCH /exercise-types/:id
Content-Type: application/json

{
  "name": "Advanced Sprint Drill",
  "event_type": "training"
}
```

### 4. Delete Exercise Type

```http
DELETE /exercise-types/:id
```

**Note**: System exercises (`is_system: true`) should be protected from deletion.

---

## 📱 Frontend Implementation

### Mobile App (React Native + SQLite)

The mobile app maintains a local SQLite database with a `backend_id` column for sync:

```typescript
// Local SQLite Schema
CREATE TABLE exercise_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  backend_id TEXT,              // ← Maps to backend UUID
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  is_system INTEGER DEFAULT 0,
  created_at INTEGER
);
```

### Sync Flow

#### Create
1. Save to local SQLite
2. POST to backend API
3. Store returned `exercise_type_id` in `backend_id` column

#### Update
1. Update local SQLite
2. Lookup `backend_id`
3. PATCH to backend API using `backend_id`

#### Delete
1. Lookup `backend_id`
2. Delete from local SQLite
3. DELETE from backend API using `backend_id`

---

## 🎓 Why This Matters for Scaling

### Data Integrity

✅ **With Aggregate Root Pattern:**
- Admin leaves → Data remains
- Hardware replaced → Data remains
- Clear ownership hierarchy
- Predictable cascade deletions

❌ **Without Aggregate Root Pattern:**
- Admin deleted → Orphaned exercises
- Pod replaced → Lost configurations
- Data corruption
- Unpredictable side effects

### Multi-Tenancy

Each club is isolated:
```
Club A → ExerciseTypes A
Club B → ExerciseTypes B
```

No cross-contamination. Perfect for SaaS.

### Future Features

Easy to add:
- Club-wide analytics
- Cross-club comparisons (by SuperAdmin)
- Club templates
- Franchise management

---

## 🚀 Best Practices

### DO ✅

1. **Always query through club_id**
   ```typescript
   where: { club_id: admin.club_id }
   ```

2. **Include club relation in responses**
   ```typescript
   include: { club: { select: { club_id: true, club_name: true } } }
   ```

3. **Protect system exercises**
   ```typescript
   if (exercise.is_system) {
     throw new ForbiddenException('Cannot delete system exercises');
   }
   ```

### DON'T ❌

1. **Don't query by admin_id or pod_holder_id**
   ```typescript
   where: { admin_id }  // ← WRONG!
   ```

2. **Don't allow direct exercise access without club context**
   ```typescript
   // ❌ Bad
   GET /exercise-types/:id
   
   // ✅ Good
   GET /exercise-types/:id (then verify club_id matches user's club)
   ```

3. **Don't delete exercises when deleting admins/pods**
   - Let Prisma cascade handle Club → ExerciseType
   - Never cascade from Admin → ExerciseType

---

## 📚 Related Patterns

This same pattern applies to:

- ✅ `Player` → `Club`
- ✅ `Coach` → `Club`
- ✅ `Event` → `Club`
- ✅ `PodHolder` → `Club`
- ✅ `HrZoneDefaults` → `Club`

**Remember**: Club is the Aggregate Root. Everything else is either:
1. **Owned by Club** (Players, Exercises, Events)
2. **Manages Club data** (Admins, Coaches)
3. **Uses Club data** (PodHolders, Pods)

---

## 🎯 Summary

| Concept | Implementation |
|---------|----------------|
| **Ownership** | Club owns ExerciseTypes |
| **Access** | Always query through `club_id` |
| **Deletion** | Cascade from Club, not from Admin/Pod |
| **Sync** | Mobile app tracks `backend_id` for CRUD |
| **Pattern** | Aggregate Root (Enterprise DDD) |

**Mental Model**: 
> "Club is the company. Exercises are SOPs. Employees manage them. Machines use them. But the company owns them."

---

## 📞 Questions?

If you need clarification on:
- Event → Player → Pod → RawData pipeline
- ActivityMetric aggregation
- Session design
- Offline sync logic

Just ask! 👍
