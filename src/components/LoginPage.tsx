/** @jsxImportSource hono/jsx */
interface LoginPageProps {
  error?: boolean
}

export function LoginPage({ error }: LoginPageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sign In — Fleet Portal</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-50 min-h-screen flex items-center justify-center">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-slate-900">Fleet Portal</h1>
            <p class="text-slate-500 mt-1 text-sm">Sign in to manage your fleet cards</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            {error && (
              <div class="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                Invalid username or password. Please try again.
              </div>
            )}

            <form method="POST" action="/login" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="username">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autocomplete="username"
                  placeholder="your username"
                  class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autocomplete="current-password"
                  class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                class="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors mt-2"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </body>
    </html>
  )
}
