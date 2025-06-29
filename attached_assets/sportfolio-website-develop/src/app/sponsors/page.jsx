import React from 'react';
import InnerPageBanner from "@/components/InnerPageBanner";

export default function Sponsors() {
  return (
    <main className="min-h-screen p-24 text-left">
      <InnerPageBanner
            title={{
                one: 'GROWING',
                two: 'SPORTS',
                three: 'COMMUNITY'
            }}
            bgImage="../athletics.jpg"
        />
      <div className='flex justify-center py-10'>
      <div className='max-w-[1000px] shadow-lg p-10 rounded-lg border'>
      <h2 className='text-center mt-5 font-bold text-3xl'>Join Us as a Sponsor for Sportfolio’s <br/> Growing Sports Community!</h2>
      <p>
        Sportfolio is on a mission to revolutionize the way sports enthusiasts and athletes connect, compete, and grow. Our platform is dedicated to offering event listings, team creation, and score tracking across various sports, fostering a dynamic and engaging space for sports of all kinds. With exciting new features launching soon, there’s never been a better time to partner with us and make an impact within the sports community!
      </p>
      <h3 className='mt-5 font-bold text-2xl text-left'>Why Sponsor Sportfolio?
      </h3>
      <hr className='mb-4' />
      <p><strong>Visibility with a Targeted Audience</strong><br />
        By sponsoring Sportfolio, your brand gains exposure to a dedicated community of sports enthusiasts, athletes, event organizers, and fans. With each event, team collaboration, and participant profile, your brand becomes a part of their sporting journey, ensuring that your products and services are associated with excitement, energy, and community spirit.
      </p>

      <p><strong>Strengthen Your Brand Identity in Sports</strong><br />
        Position your brand as a supporter of sports development and community-building. Sportfolio connects thousands of users who are passionate about their sport and eager to explore and engage with brands that support their interests. Sponsorship with us reinforces your brand’s commitment to promoting active, healthy lifestyles and inspiring athletic achievements.
      </p>


      <p><strong>Engagement Opportunities Through Events</strong><br />
        From grassroots leagues to regional tournaments, Sportfolio’s diverse events allow you to showcase your brand directly within specific sports and communities. Whether it’s through event naming rights, branded team uniforms, or promotional materials on event pages, you’ll enjoy unique opportunities to interact with fans and participants where they’re most engaged.
      </p>

      <p><strong>
        Customized Sponsorship Packages
      </strong><br />
        We offer flexible sponsorship options tailored to meet your objectives, from digital banners on our platform to co-branded events and promotional campaigns. Work with our team to create a package that aligns with your brand’s goals, delivering real value and measurable results.

      </p>


      <p><strong>
        Support a Positive Sports Culture
      </strong><br />
        Your sponsorship contributes directly to the growth of our platform and enables athletes and fans to enjoy enhanced features. Together, we can create a vibrant sports ecosystem that empowers athletes and brings communities closer through shared experiences and positive interactions.
      </p>

      <hr className="my-3" />
      <h3 className='mt-5 font-bold text-2xl'>
        Let’s Create a Winning Partnership
      </h3>
      <p>
        Partnering with Sportfolio means more than just visibility; it’s a chance to be part of the future of sports engagement and community connection. Join us as we continue to build a supportive and active sports community that celebrates all athletes, teams, and sports.
        <hr />
        We’d love to discuss how Sportfolio can align with your brand goals. Let’s explore this exciting opportunity to grow together!
      </p>
      </div>
      </div>
    </main>
  );
}
