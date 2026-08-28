// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'GovTech LGC2+ Portal',
  description: 'Tenant Onboarding and Resource Allocation Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        
        {/* GLOBAL HEADER */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* GovTech Logo & Title */}
              <div className="flex items-center">
                <img 
                  src="/govtech-logo.png" 
                  alt="GovTech Logo" 
                  className="h-10 w-auto object-contain" 
                />
                <span className="ml-3 font-bold text-xl text-gray-900 tracking-tight">
                  GovTech LGC2+ Portal
                </span>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center space-x-4">
                <a 
                  href="/" 
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Onboarding Form
                </a>
                <a 
                  href="/admin" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors"
                >
                  Admin Portal
                </a>
              </div>
              
            </div>
          </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <div className="flex-grow">
          {children}
        </div>

        {/* GLOBAL FOOTER */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} GovTech Sri Lanka. All rights reserved.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}