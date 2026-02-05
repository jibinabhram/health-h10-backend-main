# 🎯 Quick Reference: Aggregate Root Pattern

## One-Liner
> **Club owns everything. Admins manage. Pods use. Never the other way around.**

---

## 🏢 Ownership Hierarchy

```
Club (OWNS)
 ├─ ExerciseTypes ✅
 ├─ Players ✅
 ├─ Coaches ✅
 ├─ Events ✅
 ├─ PodHolders ✅
 └─ Subscriptions ✅

ClubAdmin (MANAGES)
 └─ Club data ⚙️

PodHolder (USES)
 └─ Club data 📡
```

---

## ✅ DO

```typescript
// Query through club
const exercises = await prisma.exerciseType.findMany({
  where: { club_id: admin.club_id }
});
```

```http
GET /exercise-types?club_id=xxx
```

---

## ❌ DON'T

```typescript
// ❌ Never query by admin/pod
const exercises = await prisma.exerciseType.findMany({
  where: { admin_id }  // WRONG!
});
```

```prisma
// ❌ Never create this relation
model ExerciseType {
  admin_id String  // WRONG!
  admin ClubAdmin @relation(...)  // WRONG!
}
```

---

## 🔄 Access Pattern

```
User Request
    ↓
Get User's club_id
    ↓
Query: WHERE club_id = ?
    ↓
Return Results
```

---

## 🗑️ Deletion Rules

| Delete | Cascades To |
|--------|-------------|
| Club | ✅ All exercises, players, events, etc. |
| Admin | ❌ Nothing (admin is just a manager) |
| PodHolder | ❌ Nothing (hardware is just a tool) |

---

## 💡 Mental Model

| Entity | Analogy |
|--------|---------|
| Club | Company |
| ExerciseType | SOP Document |
| Admin | Employee |
| PodHolder | Machine |

**Who owns company SOPs?** → The Company (Club)

---

## 📱 Frontend Sync

```typescript
// CREATE
1. Save to SQLite
2. POST to backend
3. Store backend UUID in backend_id

// UPDATE
1. Update SQLite
2. Get backend_id
3. PATCH /exercise-types/:backend_id

// DELETE
1. Get backend_id
2. Delete from SQLite
3. DELETE /exercise-types/:backend_id
```

---

## 🎓 Remember

- **Club = Aggregate Root**
- **Everything belongs to Club**
- **Access through club_id**
- **Never bypass the hierarchy**

---

**Full docs**: See `EXERCISE_TYPES_ARCHITECTURE.md`
