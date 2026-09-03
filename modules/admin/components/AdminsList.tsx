import type { listAdmins } from "@/services/admins/listAdmins";

export function AdminsList({ admins }: { admins: Awaited<ReturnType<typeof listAdmins>> }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy/10">
            <th className="px-4 py-3 font-semibold text-navy/60">Name</th>
            <th className="px-4 py-3 font-semibold text-navy/60">Email</th>
            <th className="px-4 py-3 font-semibold text-navy/60">Role</th>
            <th className="px-4 py-3 font-semibold text-navy/60">Status</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-b border-navy/5 last:border-0">
              <td className="px-4 py-3 text-navy">{admin.name}</td>
              <td className="px-4 py-3 text-navy/70">{admin.email}</td>
              <td className="px-4 py-3 text-navy/70">{admin.roles.join(", ")}</td>
              <td className="px-4 py-3">
                {admin.isActive ? (
                  <span className="text-gold-d">Active</span>
                ) : (
                  <span className="text-blush-i">Disabled</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
