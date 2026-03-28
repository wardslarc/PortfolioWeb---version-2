export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground">
      <div>
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          The page you requested does not exist in this portfolio.
        </p>
      </div>
    </main>
  );
}
