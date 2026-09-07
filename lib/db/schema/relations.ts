import { relations } from "drizzle-orm";
import { users } from "./users";
import { roles } from "./roles";
import { permissions } from "./permissions";
import { userRoles } from "./user-roles";
import { rolePermissions } from "./role-permissions";
import { feedbackCategories } from "./feedback-categories";
import { forms } from "./forms";
import { formQuestions } from "./form-questions";
import { questionOptions } from "./question-options";
import { formResponses } from "./form-responses";
import { responseAnswers } from "./response-answers";
import { formReviewers } from "./form-reviewers";
import { sessions } from "./sessions";
import { invites } from "./invites";

export const usersRelations = relations(users, ({ many }) => ({
  formsCreated: many(forms),
  userRoles: many(userRoles),
  reviewingForms: many(formReviewers),
  sessions: many(sessions),
  invites: many(invites),
}));

export const invitesRelations = relations(invites, ({ one }) => ({
  user: one(users, { fields: [invites.userId], references: [users.id] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const feedbackCategoriesRelations = relations(
  feedbackCategories,
  ({ many }) => ({
    forms: many(forms),
  }),
);

export const formsRelations = relations(forms, ({ one, many }) => ({
  category: one(feedbackCategories, {
    fields: [forms.categoryId],
    references: [feedbackCategories.id],
  }),
  creator: one(users, {
    fields: [forms.createdBy],
    references: [users.id],
  }),
  questions: many(formQuestions),
  responses: many(formResponses),
  reviewers: many(formReviewers),
}));

export const formQuestionsRelations = relations(
  formQuestions,
  ({ one, many }) => ({
    form: one(forms, {
      fields: [formQuestions.formId],
      references: [forms.id],
    }),
    options: many(questionOptions),
    answers: many(responseAnswers),
  }),
);

export const questionOptionsRelations = relations(
  questionOptions,
  ({ one }) => ({
    question: one(formQuestions, {
      fields: [questionOptions.questionId],
      references: [formQuestions.id],
    }),
  }),
);

export const formResponsesRelations = relations(
  formResponses,
  ({ one, many }) => ({
    form: one(forms, {
      fields: [formResponses.formId],
      references: [forms.id],
    }),
    answers: many(responseAnswers),
  }),
);

export const responseAnswersRelations = relations(
  responseAnswers,
  ({ one }) => ({
    response: one(formResponses, {
      fields: [responseAnswers.responseId],
      references: [formResponses.id],
    }),
    question: one(formQuestions, {
      fields: [responseAnswers.questionId],
      references: [formQuestions.id],
    }),
  }),
);

export const formReviewersRelations = relations(formReviewers, ({ one }) => ({
  form: one(forms, {
    fields: [formReviewers.formId],
    references: [forms.id],
  }),
  user: one(users, {
    fields: [formReviewers.userId],
    references: [users.id],
  }),
}));
