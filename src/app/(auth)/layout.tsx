export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sal-bg px-4">
      {children}
      <p className="mt-8 text-xs text-sal-text-muted">
        Responsible Intelligence
      </p>
    </div>
  );
}
