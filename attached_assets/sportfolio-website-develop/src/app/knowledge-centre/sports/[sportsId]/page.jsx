import React from 'react';
import KsContent from "@/components/ks/Content";
import KsSidebar from "@/components/ks/Sidebar";

export function generateStaticParams() {
  return [{ sportsId: 'archery' }, { sportsId: 'athletics' }, { sportsId: 'badminton' }]
}

export default async function KnowledgeItem({ params }) {
    const { sportsId } = await params
  return (
    <main className="flex min-h-screen flex-row items-start p-24">
      <div className="flex-none">
        <KsSidebar />
      </div>
      <div className="flex-grow">
        <KsContent sportsId={sportsId} />
      </div>
    </main>
  );
}
