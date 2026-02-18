export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-80 border rounded p-6">
        <h1 className="text-xl font-bold mb-1">Outlet Media</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to continue</p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2 text-sm" placeholder="you@outletmedia.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="w-full bg-black text-white rounded px-3 py-2 text-sm">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
