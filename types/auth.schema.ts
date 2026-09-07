import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const createAdminSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "At least 8 characters."),
});
export type CreateAdminInput = z.infer<typeof createAdminSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "At least 8 characters."),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const LANGUAGES = ["en", "fr", "sw"] as const;
export const updateLanguageSchema = z.object({
  language: z.enum(LANGUAGES),
});
export type UpdateLanguageInput = z.infer<typeof updateLanguageSchema>;
