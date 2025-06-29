import React from 'react';
import EventBanner from "@/components/events/banner";
// import EventListing from "@/components/events/listing";
// import SearchBar from "@/components/home/SearchBar";
// import EventData from '@/static/events.json'

export default function Events() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <EventBanner />
      {/* <SearchBar /> 
    <EventListing data={EventData} /> */}
      <div className='flex justify-center py-10'>
        <div className='max-w-[1000px] shadow-lg p-10 rounded-lg border'>
          <p>
            Sportfolio is excited to announce an enhanced experience for sports enthusiasts and players alike with the release of new features centered around event participation and team building. Soon, users will be able to create and browse a wide range of sports events—local tournaments, training camps, and competitive leagues—all within the platform. These listings will provide comprehensive event details, including schedules, locations, registration fees, and participant limits, making it simple for athletes, fans, and organizers to connect and engage.
          </p>
          <h3 className='mt-5 font-bold text-2xl'>Event Creation and Management</h3>
          <p>
            For event organizers, Sportfolio’s new event creation tools make setting up sports events seamless. From small local competitions to larger-scale tournaments, organizers can customize their event details and manage entries with ease. With options to invite specific teams or open up registration to the public, organizers can streamline participant management, update event status in real-time, and track important metrics—ensuring a smooth experience from start to finish.
          </p>

          <h3 className='mt-5 font-bold text-2xl'>Team Creation and Invitations</h3>
          <p>
            To foster collaboration and team spirit, Sportfolio introduces a team creation feature where users can build and manage teams across various sports. Whether you’re looking to form a new soccer team, a basketball league squad, or a mixed-sport group, our team management tools help streamline team organization and communication. Organizers can also send out team invites for specific events, simplifying the recruitment of team members and enabling teams to join events with just a few clicks.
          </p>
          <h3 className='mt-5 font-bold text-2xl'>Real-Time Event Score and Status Tracking</h3>
          <p>
            Sportfolio is enhancing the excitement of sports events by offering real-time score and status tracking. Participants, coaches, and fans can follow along as games unfold, with live updates on scores, match progress, and player statistics. This tracking feature will be integrated directly into each event listing, allowing everyone involved to stay informed and engaged, whether they’re on the field or cheering from the sidelines.
          </p>
          <h3 className='mt-5 font-bold text-2xl'>Seamless Individual and Team Participation</h3>
          <p>
            One of the core goals of Sportfolio’s new release is to empower both individuals and teams to participate in events effortlessly. Players can sign up for events on their own or join as part of a team, providing flexibility for solo athletes as well as established groups. Registration is straightforward, and with customizable profiles for both individuals and teams, participants can showcase their skills, past performances, and achievements, making it easier to get involved and stay connected in the sports community.
          </p>
        </div>
      </div>

    </main>
  );
}
