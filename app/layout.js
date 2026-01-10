import './globals.css'

export const metadata = {
  title: 'RE | Group Intelligence Hub',
  description: 'Luxury Real Estate CRM for Roxanna Urban',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
