"use client"
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import CustomCursor from "../app/componennts/CustomCursor";
import ParticlesBackground from "../app/componennts/ParticlesBackground";



export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
          <ParticlesBackground />
        </div> */}

        <CustomCursor />
        <SessionProvider>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
