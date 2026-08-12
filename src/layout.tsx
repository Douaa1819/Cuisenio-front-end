import { Outlet } from "react-router-dom"
import "./globals.css"

export default function RootLayout() {
  return (
    <div className="font-sans">
      <Outlet />
    </div>
  )
}

