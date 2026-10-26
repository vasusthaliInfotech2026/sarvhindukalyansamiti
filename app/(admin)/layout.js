import "@/app/globals.css";

export const metadata = {
  title: "Admin Control Panel - Sarv Hindu Kalyan Samiti",
  description: "Secure Admin Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}