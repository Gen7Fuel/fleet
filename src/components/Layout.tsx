/** @jsxImportSource hono/jsx */
interface LayoutProps {
  title: string
  username?: string
  company?: string
  children: any
}

export function Layout({ title, username, company, children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — Fleet Portal</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-50 min-h-screen">
        {username && (
          <header class="bg-white border-b border-slate-200">
            <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <span class="text-slate-900 font-semibold text-sm">Fleet Portal</span>
                  {company && <span class="text-slate-400 text-sm ml-2">/ {company}</span>}
                </div>
              </div>
              <div class="flex items-center gap-5">
                <span class="text-slate-500 text-sm">{username}</span>
                <a href="/logout" class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Sign out
                </a>
              </div>
            </div>
          </header>
        )}
        <main class="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
