// src/app/live/page.tsx
import { redirect } from 'next/navigation';

export default function LivePage() {
  // Redireciona imediatamente para /eventos
  redirect('/eventos');
  
  return null;
}