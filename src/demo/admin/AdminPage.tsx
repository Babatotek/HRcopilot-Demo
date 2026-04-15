// ============================================
// FILE: src/demo/admin/AdminPage.tsx
// PURPOSE: Root admin page — handles login state,
//          renders login or shell accordingly.
//          Completely isolated from main app.
// ============================================

import { useState } from 'react';
import { isAdminLoggedIn } from './adminAuth';
import { AdminLogin } from './AdminLogin';
import { AdminShell } from './AdminShell';

export function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => isAdminLoggedIn());

  if (!loggedIn) {
    return <AdminLogin onSuccess={() => setLoggedIn(true)} />;
  }

  return <AdminShell onLogout={() => setLoggedIn(false)} />;
}
