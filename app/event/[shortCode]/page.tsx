import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SignInForm } from "./sign-in-form"
import { PropertyHero } from "./property-hero"
import { AgentCard } from "./agent-card"

interface PageProps {
  params: Promise<{
    shortCode: string
  }>
}

export default async function EventPage({ params }: PageProps) {
  const { shortCode } = await params

  const event = await prisma.openHouseEvent.findUnique({
    where: { shortCode },
  })

  if (!event) {
    notFound()
  }

  const propertyPhotos = JSON.parse(event.propertyPhotos) as string[]

  return (
    <div className="min-h-screen bg-background">
      <PropertyHero
        photos={propertyPhotos}
        address={event.propertyAddress}
        price={event.price}
        bedrooms={event.bedrooms}
        bathrooms={event.bathrooms}
        squareFeet={event.squareFeet}
        welcomeMessage={event.welcomeMessage}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AgentCard
          name={event.agentName}
          photo={event.agentPhoto}
          brokerage={event.agentBrokerage}
          email={event.agentEmail}
          phone={event.agentPhone}
        />

        <div className="mt-8">
          <SignInForm eventId={event.id} shortCode={shortCode} />
        </div>
      </div>
    </div>
  )
}
