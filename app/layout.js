import './globals.css'

export const metadata = {
  title: 'Smart Bookmark App',
  description: 'Manage your bookmarks with real-time sync',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
