export const metadata = {
  title: "Privacy Policy - Outlet Media",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: March 2, 2026</p>

      <h2>1. Who We Are</h2>
      <p>
        Outlet Media operates the Outlet Media advertising management platform.
        Contact us at: support@outletmedia.co
      </p>

      <h2>2. What Data We Collect</h2>
      <p>When you connect your Meta (Facebook) ad account, we access:</p>
      <ul>
        <li>Your Facebook user ID (for account linking)</li>
        <li>Ad account ID and name</li>
        <li>Campaign performance data: spend, impressions, clicks, click-through rate, cost per click, cost per thousand impressions, purchase return on ad spend</li>
        <li>Campaign configuration: name, status, daily budget, start date</li>
        <li>Ad creative metadata: thumbnail URL, title text, body text</li>
        <li>Audience breakdown data: age, gender, placement performance</li>
      </ul>
      <p>We also collect your email address and name when you create an account via our authentication provider (Clerk).</p>

      <h2>3. How We Use Your Data</h2>
      <ul>
        <li>Display your campaign performance metrics in your portal dashboard</li>
        <li>Create, edit, pause, and manage advertising campaigns on your behalf when you use our campaign management tools</li>
        <li>Generate performance insights and recommendations</li>
        <li>Send you notifications about campaign performance changes</li>
      </ul>
      <p>We do not use your data for advertising profiling, sale to third parties, or any purpose other than providing the services described above.</p>

      <h2>4. Data Sharing</h2>
      <p>We share your data only with the following service providers, strictly for operating our platform:</p>
      <ul>
        <li>Supabase (database hosting)</li>
        <li>Clerk (authentication)</li>
        <li>Railway (application hosting)</li>
        <li>Meta (Facebook) Ads API (campaign management)</li>
      </ul>
      <p>We do not sell your data to any third party.</p>

      <h2>5. Data Retention</h2>
      <p>We retain your data for as long as your account is active. Campaign performance snapshots are stored daily for historical trend analysis. When you disconnect your ad account, we stop accessing new data but retain historical snapshots unless you request deletion.</p>

      <h2>6. Your Right to Delete Your Data</h2>
      <p>You can request deletion of all your data at any time, regardless of your location. There are no fees, no approval process, and no geographic restrictions. To request deletion:</p>
      <ul>
        <li>Disconnect your ad account in Settings, then contact us at support@outletmedia.co to request full data deletion</li>
        <li>Or use Facebook's data deletion request (we process these automatically within 48 hours)</li>
      </ul>
      <p>Upon deletion, we remove your encrypted access token, cached campaign data, and account records from our database.</p>

      <h2>7. Data Security</h2>
      <p>Access tokens are encrypted at rest using AES-256-GCM. All communication uses HTTPS. We follow the principle of least privilege for data access.</p>

      <h2>8. Changes to This Policy</h2>
      <p>We will update this page when our practices change. The "last updated" date at the top reflects the most recent revision.</p>
    </div>
  );
}
