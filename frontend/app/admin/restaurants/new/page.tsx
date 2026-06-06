"use client";

import { Sidebar } from '@/app/admin/components/Sidebar'; 
import { RestaurantForm } from '../components/RestaurantForm';

export default function NewRestaurantPage() {
  return (
    <div className="flex bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 w-full overflow-y-auto">
        <RestaurantForm />
      </main>
    </div>
  );
}