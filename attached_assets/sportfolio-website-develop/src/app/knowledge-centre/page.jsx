import React from 'react';
import KsContent from "@/components/ks/Content";
import KsSidebar from "@/components/ks/Sidebar";

export default function KnowledgeCentre() {
  return (
    <main className="flex min-h-screen flex-row items-start p-24">
      <div className="flex-none">
        <KsSidebar />
      </div>
      <div className="flex-grow">
        <KsContent />
      </div>
    </main>
  );
}
