import { db } from "./client";
import {
  forms,
  formQuestions,
  questionOptions,
  roles,
  permissions,
  rolePermissions,
  users,
  userRoles,
} from "./schema";
import { eq } from "drizzle-orm";
import { pillars } from "@/modules/shared/data/pillars";
import { FEEDBACK_FORM_SLUG } from "@/modules/shared/data/feedback-form";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/auth/permissions";
import { hashPassword } from "@/lib/auth/hashPassword";

const FORM_SLUG = FEEDBACK_FORM_SLUG;

async function seedPermissions() {
  const byName = new Map<string, string>();
  for (const p of PERMISSIONS) {
    const existing = await db.query.permissions.findFirst({ where: eq(permissions.name, p.name) });
    const row =
      existing ??
      db.insert(permissions).values({ name: p.name, description: p.description }).returning().get();
    byName.set(p.name, row.id);
  }
  return byName;
}

async function seedRoles(permissionIdByName: Map<string, string>) {
  const roleIdByName = new Map<string, string>();

  for (const roleName of Object.keys(ROLE_PERMISSIONS) as Array<keyof typeof ROLE_PERMISSIONS>) {
    const existing = await db.query.roles.findFirst({ where: eq(roles.name, roleName) });
    const role = existing ?? db.insert(roles).values({ name: roleName }).returning().get();
    roleIdByName.set(roleName, role.id);

    for (const permissionName of ROLE_PERMISSIONS[roleName]) {
      const permissionId = permissionIdByName.get(permissionName)!;
      const already = await db.query.rolePermissions.findFirst({
        where: (rp, { and, eq }) => and(eq(rp.roleId, role.id), eq(rp.permissionId, permissionId)),
      });
      if (!already) {
        db.insert(rolePermissions).values({ roleId: role.id, permissionId }).run();
      }
    }
  }

  return roleIdByName;
}

async function seedSuperAdmin(roleIdByName: Map<string, string>) {
  const email = process.env.SEED_SUPER_ADMIN_EMAIL ?? "admin@maria-muwale.local";
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "change-this-password-123";

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) return existing;

  const passwordHash = await hashPassword(password);
  const admin = db.insert(users).values({ name: "Super Admin", email, passwordHash }).returning().get();

  db.insert(userRoles)
    .values({ userId: admin.id, roleId: roleIdByName.get("super_admin")! })
    .run();

  console.log(`Seeded super_admin: ${email} / ${password} (change this password)`);
  return admin;
}

async function seedDemoForm(createdBy: string) {
  const existing = await db.query.forms.findFirst({ where: eq(forms.slug, FORM_SLUG) });
  if (existing) {
    await db.delete(forms).where(eq(forms.id, existing.id));
  }

  const form = db
    .insert(forms)
    .values({
      title: "Campaign Feedback",
      slug: FORM_SLUG,
      description: "Tell Maria what matters to you. This takes less than a minute.",
      status: "published",
      allowAnonymous: true,
      createdBy,
    })
    .returning()
    .get();

  const pillarQuestion = db
    .insert(formQuestions)
    .values({
      formId: form.id,
      type: "single_choice",
      question: "Which pillar matters most to you?",
      isRequired: true,
      sortOrder: 0,
    })
    .returning()
    .get();

  pillars.forEach((pillar, i) => {
    db.insert(questionOptions)
      .values({
        questionId: pillarQuestion.id,
        label: pillar.title,
        value: pillar.title,
        sortOrder: i,
      })
      .run();
  });

  db.insert(formQuestions)
    .values({
      formId: form.id,
      type: "rating",
      question: "How would you rate this campaign page?",
      isRequired: true,
      sortOrder: 1,
    })
    .run();

  db.insert(formQuestions)
    .values({
      formId: form.id,
      type: "textarea",
      question: "Any other feedback?",
      isRequired: false,
      sortOrder: 2,
    })
    .run();

  console.log(`Seeded form "${form.title}" at /forms/${form.slug}`);
}

async function seed() {
  const permissionIdByName = await seedPermissions();
  const roleIdByName = await seedRoles(permissionIdByName);
  const superAdmin = await seedSuperAdmin(roleIdByName);
  await seedDemoForm(superAdmin.id);
}

seed();
