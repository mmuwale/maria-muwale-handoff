import type { listAdmins } from "@/services/admins/listAdmins";
import { DeleteAdminButton } from "./DeleteAdminButton";

export function AdminsList({
  admins,
  currentUserId,
  canDelete,
}: {
  admins: Awaited<ReturnType<typeof listAdmins>>;
  currentUserId: string;
  canDelete: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy/10">
            <th className="px-4 py-3 font-semibold text-navy/60">Name</th>
            <th className="px-4 py-3 font-semibold text-navy/60">Email</th>
            <th className="px-4 py-3 font-semibold text-navy/60">Role</th>
            <th className="px-4 py-3 font-semibold text-navy/60">Status</th>
            {canDelete && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-b border-navy/5 last:border-0">
              <td className="px-4 py-3 text-navy">{admin.name}</td>
              <td className="px-4 py-3 text-navy/70">{admin.email}</td>
              <td className="px-4 py-3 text-navy/70">{admin.roles.join(", ")}</td>
              <td className="px-4 py-3">
                {admin.invitePending ? (
                  <span className="text-navy/50">Invite pending</span>
                ) : admin.isActive ? (
                  <span className="text-gold-d">Active</span>
                ) : (
                  <span className="text-blush-i">Disabled</span>
                )}
              </td>
              {canDelete && (
                <td className="px-4 py-3 text-right">
                  {admin.id !== currentUserId && (
                    <DeleteAdminButton userId={admin.id} name={admin.name} />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
