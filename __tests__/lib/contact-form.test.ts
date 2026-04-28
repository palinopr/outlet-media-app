import { describe, it, expect } from "vitest";
import { buildLandingContactPayload } from "@/components/landing/contact-form";
import { ContactFormSchema } from "@/lib/api-schemas";

describe("ContactFormSchema", () => {
  it("accepts valid submission", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I'd like a demo.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane",
      email: "not-an-email",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = ContactFormSchema.safeParse({
      name: "",
      email: "jane@example.com",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty message", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("builds an API-compatible landing fallback payload", () => {
    const formData = new FormData();
    formData.set("name", "Jaime Ortiz");
    formData.set("phone", "+1 305 322 5709");
    formData.set("email", "jaime@example.com");
    formData.set("company", "Outlet Live");
    formData.set("monthlyBudget", "$5K — $20K");
    formData.set("goal", "Sell more tickets next week");

    const payload = buildLandingContactPayload(formData);

    expect(payload).toMatchObject({
      name: "Jaime Ortiz",
      phone: "+1 305 322 5709",
      email: "jaime@example.com",
      company: "Outlet Live",
      monthlyBudget: "$5K — $20K",
      goal: "Sell more tickets next week",
      preferredContact: "WhatsApp",
      pageContext: "landing-audit-funnel",
    });
    expect(ContactFormSchema.safeParse(payload).success).toBe(true);
  });
});
