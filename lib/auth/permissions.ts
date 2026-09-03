/** The full permission catalog and the two starter roles. Single source of
 *  truth for the seed script - router files check these same string names. */
export const PERMISSIONS = [
  { name: "forms.create", description: "Create feedback forms" },
  { name: "forms.view", description: "View forms you own or review" },
  { name: "forms.viewAll", description: "View every form in the system" },
  { name: "forms.update", description: "Edit forms you own or review" },
  { name: "forms.publish", description: "Publish a form you own or review" },
  { name: "forms.delete", description: "Delete forms you own or review" },
  { name: "feedback.view", description: "View responses to forms you own or review" },
  { name: "feedback.viewAll", description: "View responses to every form" },
  { name: "feedback.export", description: "Export response data" },
  { name: "feedback.delete", description: "Delete responses" },
  { name: "admins.create", description: "Create feedback admin accounts" },
  { name: "admins.view", description: "View admin accounts" },
  { name: "admins.update", description: "Update admin accounts" },
  { name: "admins.delete", description: "Delete admin accounts" },
] as const;

export const ROLE_PERMISSIONS = {
  super_admin: PERMISSIONS.map((p) => p.name),
  feedback_admin: [
    "forms.create",
    "forms.view",
    "forms.update",
    "forms.publish",
    "feedback.view",
  ],
} as const;
