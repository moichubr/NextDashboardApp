import '@/app/ui/global.css';
import {inter} from "@/app/ui/fonts"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}


//al darle al body la clase inter, aplica esa fuente a toda la app
//la clase de tw antialiased suaviza la fuente