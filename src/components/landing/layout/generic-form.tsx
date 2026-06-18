"use client";

import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Field as UIField,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeepValue, FormValidateOrFn, Updater, useForm } from "@tanstack/react-form";
import * as z from "zod";
import { $ZodTypeInternals } from "zod/v4/core";

/**
 * Configuration for a single form field.
 *
 * @template T - The type of the form data.
 */
export type FieldConfig<T> = {
  /** The key in the form data object that this field corresponds to */
  name: Extract<keyof T, string>;
  /** The display label for the field */
  label: string;
  /** The input type (default: "text") */
  type?: "text" | "textarea" | "email" | "password" | "number" | "file" | "select" | "date";
  /** Optional placeholder text for the input */
  placeholder?: string;
  /** Optional descriptive text displayed below the field */
  description?: string;
  /** Optional file acceptance types for file inputs (e.g., ".pdf") */
  accept?: string;
  /** Optional options for select fields */
  options?: {
    label: string;
    value: string;
  }[];
  /** Optional minimum value for number inputs */
  min?: number;
  /** Optional maximum value for number inputs */
  max?: number;
  /** Optional step for number inputs */
  step?: number;
};

/**
 * Props for the GenericForm component.
 *
 * @template T - The type of the form data.
 */
interface GenericFormProps<T> {
  /** The title of the form */
  title: string;
  /** Optional description for the form */
  description?: string;
  /** The Zod validation schema for the form */
  schema: z.ZodType<T, unknown, $ZodTypeInternals<T, unknown>>;
  /** Initial values for the form fields */
  defaultValues: T;
  /** Callback function triggered on valid form submission */
  onSubmit: (values: T) => Promise<void> | void;
  /** Array of field configurations */
  fields: FieldConfig<T>[];
  /** Optional custom text for the submit button (default: "Submit") */
  submitText?: string;
  /** Optional global error message to display in the form */
  error?: string | null;
  /** Optional callback function to reset the form */
  onReset?: () => void;
  /** Optional custom text for the reset button (default: "Reset") */
  resetText?: string;
  /** Optional custom text for the submitting state (default: "Submitting...") */
  submittingText?: string;
  /** Optional flag to hide the reset button */
  hideReset?: boolean;
  /** Optional flag to reset the form after successful submission */
  resetOnSubmit?: boolean;
  /** Optional flag to hide the submit button */
  hideSubmit?: boolean;
  /** Optional form element id attribute */
  formId?: string;
}

/**
 * A highly reusable, type-safe generic form component built on TanStack Form and Zod.
 *
 * @template T - The type of the form data, typically a Zod schema inference.
 *
 * @param {GenericFormProps<T>} props - The component props.
 * @param {z.ZodType<T>} props.schema - The Zod validation schema for the form.
 * @param {T} props.defaultValues - The initial values for the form fields.
 * @param {(values: T) => void | Promise<void>} props.onSubmit - Callback function triggered on valid form submission.
 * @param {FieldConfig<T>[]} props.fields - Array of field configurations defining labels, names, and input types.
 * @param {string} [props.submitText="Submit"] - Optional custom text for the submit button.
 * @param {string} [props.error] - Optional global error message to display in the form.
 * @param {() => void} [props.onReset] - Optional callback function to reset the form.
 *
 * @example
 * ```tsx
 * const schema = z.object({ email: z.string().email() });
 * <GenericForm
 *   schema={schema}
 *   defaultValues={{ email: "" }}
 *   fields={[{ name: "email", label: "Email Address", type: "email" }]}
 *   onSubmit={(values) => console.log(values)}
 * />
 * ```
 */

export function GenericForm<T>({
  schema,
  defaultValues,
  onSubmit,
  fields,
  submitText = "Submit",
  resetText = "Reset",
  submittingText = "Submitting...",
  error,
  onReset,
  hideReset = false,
  resetOnSubmit = false,
  hideSubmit = false,
  formId = "generic-form",
}: GenericFormProps<T>) {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema as FormValidateOrFn<T>,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value as T);

      if (resetOnSubmit) {
        form.reset();
      }
    },
  });

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <FieldGroup>
        {fields.map((fieldConfig) => (
          <form.Field key={fieldConfig.name} name={fieldConfig.name}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <UIField data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{fieldConfig.label}</FieldLabel>

                  {fieldConfig.type === "textarea" ? (
                    <Textarea
                      {...fieldConfig}
                      id={field.name}
                      name={field.name}
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value as Updater<DeepValue<T, Extract<keyof T, string>>>,
                        )
                      }
                      className="min-h-24 resize-none"
                      aria-invalid={isInvalid}
                    />
                  ) : fieldConfig.type === "select" ? (
                    <Select
                      value={(field.state.value as string) ?? ""}
                      onValueChange={(value) =>
                        field.handleChange(value as DeepValue<T, Extract<keyof T, string>>)
                      }
                    >
                      <SelectTrigger aria-invalid={isInvalid}>
                        <SelectValue placeholder={fieldConfig.placeholder} />
                      </SelectTrigger>

                      <SelectContent>
                        {fieldConfig.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : fieldConfig.type === "file" ? (
                    <Input
                      {...fieldConfig}
                      id={field.name}
                      name={field.name}
                      value={(field.state.value as string) ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const val =
                          fieldConfig.type === "number" ? Number(e.target.value) : e.target.value;

                        field.handleChange(val as DeepValue<T, Extract<keyof T, string>>);
                      }}
                      aria-invalid={isInvalid}
                    />
                  ) : (
                    <Input
                      {...fieldConfig}
                      id={field.name}
                      name={field.name}
                      value={(field.state.value ?? "") as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        // Parse numbers natively
                        const val =
                          fieldConfig.type === "number" ? Number(e.target.value) : e.target.value;
                        field.handleChange(val as DeepValue<T, Extract<keyof T, string>>);
                      }}
                      aria-invalid={isInvalid}
                    />
                  )}

                  {fieldConfig.description && (
                    <FieldDescription>{fieldConfig.description}</FieldDescription>
                  )}

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </UIField>
              );
            }}
          </form.Field>
        ))}
      </FieldGroup>
      {!hideSubmit && (
        <UIField orientation="horizontal" className="w-full justify-between">
          {!hideReset && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onReset?.();
              }}
            >
              {resetText}
            </Button>
          )}

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" form={formId} disabled={!canSubmit}>
                {isSubmitting ? submittingText : submitText}
              </Button>
            )}
          </form.Subscribe>
        </UIField>
      )}
    </form>
  );
}
