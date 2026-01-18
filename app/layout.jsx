import './globals.css'

export const metadata = {
  title: 'Kabuten 株典 - AI-powered fundamental research',
  description: 'AI-powered fundamental research for Japanese equities',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
