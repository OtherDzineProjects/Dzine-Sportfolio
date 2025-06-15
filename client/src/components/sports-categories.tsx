import { Card, CardContent } from "@/components/ui/card";

export default function SportsCategories() {
  const olympicSports = [
    { name: "Swimming", emoji: "🏊‍♀️", description: "Olympic standard pools and timing systems" },
    { name: "Badminton", emoji: "🏸", description: "Professional courts and tournament management" },
    { name: "Hockey", emoji: "🏑", description: "India's national sport with specialized facilities" },
    { name: "Wrestling", emoji: "🤼‍♂️", description: "Traditional akharas and modern training centers" }
  ];

  const traditionalSports = [
    { name: "Kabaddi", emoji: "🤸‍♂️", description: "Indigenous sport with modern league support" },
    { name: "Archery", emoji: "🏹", description: "Traditional and Olympic archery disciplines" },
    { name: "Kalaripayattu", emoji: "🥋", description: "Ancient martial art with modern training" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold section-title mb-4">
            Supporting <span className="text-saffron">All Sports</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From Olympic sports to traditional Indian games, we cover the complete spectrum
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {olympicSports.map((sport, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{sport.emoji}</div>
                <h3 className="font-semibold text-lg mb-2 text-white">{sport.name}</h3>
                <p className="text-gray-300 text-sm">{sport.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Traditional Indian Sports */}
        <div className="gradient-saffron-green rounded-2xl p-8">
          <h3 className="font-poppins font-bold text-2xl text-center mb-8 text-white">
            Traditional Indian Sports
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {traditionalSports.map((sport, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-3">{sport.emoji}</div>
                <h4 className="font-semibold mb-2 text-white">{sport.name}</h4>
                <p className="text-orange-100 text-sm">{sport.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
