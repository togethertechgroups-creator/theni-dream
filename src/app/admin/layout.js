// Admin-specific layout — no Navbar or Footer
export default function AdminLayout({ children }) {
  return (
    <div className="admin-standalone-wrapper">
      {children}
    </div>
  );
}
