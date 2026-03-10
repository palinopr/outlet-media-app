export const metadata = {
  title: "Terms of Service - Outlet Media",
};

export default function TermsPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: March 2, 2026</p>

      <h2>1. Service Description</h2>
      <p>Outlet Media provides an advertising management platform that allows users to connect their Meta (Facebook) ad accounts, view campaign performance data, and create and manage advertising campaigns.</p>

      <h2>2. Account and Access</h2>
      <p>You must have a valid Meta ad account to use our campaign management features. You are responsible for maintaining the security of your account credentials. You grant us permission to access your ad account data when you connect via Facebook Login.</p>

      <h2>3. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Violate Meta's advertising policies through our platform</li>
        <li>Provide false or misleading information</li>
        <li>Attempt to access other users' data</li>
        <li>Use the platform for any unlawful purpose</li>
      </ul>

      <h2>4. Data Ownership</h2>
      <p>You retain ownership of your ad account and all campaign data. We do not claim ownership of any data accessed through your connected ad account. You can disconnect and remove your data at any time.</p>

      <h2>5. Billing and Payments</h2>
      <p>Ad spend is billed directly by Meta to the payment method on your ad account. Outlet Media does not process ad spend payments. Any fees for our platform services will be communicated separately.</p>

      <h2>6. Limitation of Liability</h2>
      <p>Outlet Media is not responsible for: campaign performance outcomes, Meta API availability or changes, ad account suspensions by Meta, or data loss caused by third-party services. Our platform is provided "as is" without warranty of any kind.</p>

      <h2>7. Termination</h2>
      <p>Either party can terminate access at any time. You can disconnect your ad account and request data deletion. We may suspend access if you violate these terms.</p>

      <h2>8. Changes to These Terms</h2>
      <p>We will update this page when our terms change. Continued use of the platform after changes constitutes acceptance.</p>
    </div>
    </div>
  );
}
