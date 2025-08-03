import Image from "next/image";
import { TipsContainer } from "@/components/TipsContainer";
import { TicketBuilder } from "@/components/TicketBuilder";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Hero />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Tips */}
          <div className="lg:col-span-2">
            <TipsContainer />
          </div>

          {/* Sidebar - Ticket Builder */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TicketBuilder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
