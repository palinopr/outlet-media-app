import Link from "next/link";

export default function NotFound() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
            <span className="text-white text-lg font-bold">O</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-zinc-900 text-sm font-medium hover:bg-white/90 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
