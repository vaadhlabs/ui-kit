/**
 * Form — CMS-driven marketing form (contact / lead / demo).
 *
 * Ported from @tensorcost/component-library FormSection (Phase 3a). Purely
 * presentational + local field state: the caller passes `fields` (from the
 * Strapi `layout.form` schema) and an `onFormSubmit` handler that performs the
 * actual submission (the app owns the Strapi form-submission API). The submit
 * payload shape is preserved exactly so existing handlers keep working.
 *
 * Inputs render with MUI so they follow whatever theme the site is wrapped in
 * (the submit button uses `primary`, i.e. the Blueprint accent).
 */
import { useState, type ReactElement, type FormEvent } from "react";
import { Box, Typography, TextField, MenuItem, Button, Alert } from "@mui/material";
import { useSurfaces } from "./_surfaces.js";

export interface FormFieldOption {
  value?: string;
  label?: string;
}

export interface FormField {
  name: string;
  label?: string;
  /** "text" | "email" | "tel" | "textarea" | "select" | ... */
  type?: string;
  required?: boolean;
  options?: Array<FormFieldOption | string>;
}

export interface FormSubmitPayload {
  formType: string;
  name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  message: string | null;
  extraData: Record<string, unknown> | null;
  source: string;
}

export interface FormProps {
  title?: string;
  description?: string;
  /** Strapi form type — determines the submission record (contact/lead/demo). */
  formType?: string;
  fields?: FormField[];
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
  backgroundColor?: string;
  /** Caller-provided submit handler — receives the assembled payload. */
  onFormSubmit?: (payload: FormSubmitPayload) => Promise<void> | void;
  className?: string;
}

export function Form({
  title,
  description,
  formType = "contact",
  fields = [],
  submitButtonText = "Submit",
  successMessage = "Thank you! We'll be in touch soon.",
  errorMessage = "Something went wrong. Please try again.",
  backgroundColor,
  onFormSubmit,
  className,
}: FormProps): ReactElement {
  const s = useSurfaces();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (name: string, value: string) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { name, email, company, phone, message, ...extraFields } = formData;
      const payload: FormSubmitPayload = {
        formType,
        name: name || null,
        email: email || formData.work_email || formData.workEmail || null,
        company: company || null,
        phone: phone || null,
        message: message || null,
        extraData: Object.keys(extraFields).length > 0 ? extraFields : null,
        source: typeof window !== "undefined" ? window.location.href : "",
      };
      if (onFormSubmit) await onFormSubmit(payload);
      setSubmitted(true);
    } catch (err) {
      setError((err as Error)?.message || errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const sectionSx = { background: backgroundColor || s.page, py: "4rem", px: "2rem" } as const;

  if (submitted) {
    return (
      <Box component="section" className={className} sx={sectionSx}>
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <Alert severity="success" sx={{ fontSize: "1.05rem", justifyContent: "center" }}>
            {successMessage}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="section" className={className} sx={sectionSx}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {(title || description) && (
          <Box sx={{ textAlign: "center", mb: "2rem" }}>
            {title && (
              <Typography component="h2" sx={{ fontSize: "2rem", fontWeight: 700, mb: "0.5rem", color: "text.primary" }}>
                {title}
              </Typography>
            )}
            {description && (
              <Typography sx={{ fontSize: "1.1rem", color: "text.secondary" }}>{description}</Typography>
            )}
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {fields.map((field, idx) => {
            const common = {
              id: field.name,
              name: field.name,
              label: field.label,
              required: field.required,
              value: formData[field.name] || "",
              onChange: (e: { target: { value: string } }) => setField(field.name, e.target.value),
              fullWidth: true,
            };
            if (field.type === "textarea") {
              return <TextField key={field.name || idx} {...common} multiline minRows={4} />;
            }
            if (field.type === "select" && field.options) {
              return (
                <TextField key={field.name || idx} {...common} select>
                  <MenuItem value="">Select…</MenuItem>
                  {(Array.isArray(field.options) ? field.options : []).map((opt, i) => {
                    const value = typeof opt === "string" ? opt : opt.value ?? "";
                    const label = typeof opt === "string" ? opt : opt.label ?? opt.value ?? "";
                    return (
                      <MenuItem key={i} value={value}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </TextField>
              );
            }
            return <TextField key={field.name || idx} {...common} type={field.type || "text"} />;
          })}

          {error && <Alert severity="error">{error}</Alert>}

          <Box>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ textTransform: "none", fontWeight: 600 }}>
              {submitting ? "Submitting…" : submitButtonText}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Form;
