import { useEffect, useState } from "react";
import { AdminLayout } from "./layout";
import { api } from "@/lib/api";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    api
      .adminUsers()
      .then(setUsers)
      .catch((e) => setError(e?.message ?? "Failed to load users"));
  }
  useEffect(load, []);

  async function toggleRole(u: AdminUser) {
    const next = u.role === "admin" ? "user" : "admin";
    await api.adminUpdateUser(u.id, { role: next });
    load();
  }

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl text-primary mb-2">Users</h1>
      <p className="text-foreground/60 text-sm mb-8">
        All registered customers and admins.
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/60 text-foreground/60 text-xs uppercase tracking-widest">
            <tr>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3">Joined</th>
              <th className="text-right px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-t border-border/60">
                <td className="px-5 py-3 font-medium">{u.name}</td>
                <td className="px-5 py-3">{u.email}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      u.role === "admin"
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-muted border-border text-foreground/70"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-foreground/60">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => toggleRole(u)}
                    className="text-xs text-primary hover:underline"
                  >
                    Make {u.role === "admin" ? "user" : "admin"}
                  </button>
                </td>
              </tr>
            ))}
            {users && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-foreground/50">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
