import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react"

interface PageProps {
  params: Promise<{
    shortCode: string
  }>
}

export default async function DetailsPage({ params }: PageProps) {
  const { shortCode } = await params

  const event = await prisma.openHouseEvent.findUnique({
    where: { shortCode },
  })

  if (!event) {
    notFound()
  }

  const propertyPhotos = JSON.parse(event.propertyPhotos) as string[]
  const propertyFeatures = JSON.parse(event.propertyFeatures) as string[]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  // Generate Google Maps URL
  const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(event.propertyAddress)}`
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.propertyAddress)}`

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.propertyAddress}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-base px-4 py-2">
              {formatPrice(event.price)}
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              {event.bedrooms} bed
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              {event.bathrooms} bath
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              {formatNumber(event.squareFeet)} sqft
            </Badge>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {propertyPhotos.map((photo, index) => (
            <div
              key={index}
              className="relative w-full h-64 rounded-lg overflow-hidden"
            >
              <Image
                src={photo}
                alt={`${event.propertyAddress} - Photo ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {event.propertyDescription}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {propertyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{event.propertyAddress}</p>
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="outline" size="sm">
                      View on Google Maps
                    </Button>
                  </a>
                  {event.latitude && event.longitude && (
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Map would be displayed here with coordinates: {event.latitude}, {event.longitude}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Agent Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={event.agentPhoto}
                        alt={event.agentName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{event.agentName}</h3>
                      <p className="text-sm text-muted-foreground">{event.agentBrokerage}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <a
                      href={`tel:${event.agentPhone}`}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {event.agentPhone}
                    </a>
                    <a
                      href={`mailto:${event.agentEmail}`}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      {event.agentEmail}
                    </a>
                  </div>

                  <a
                    href={`mailto:${event.agentEmail}?subject=Question about ${encodeURIComponent(event.propertyAddress)}`}
                  >
                    <Button className="w-full" size="lg">
                      Questions? Contact Agent
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Price</dt>
                    <dd className="font-semibold">{formatPrice(event.price)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Bedrooms</dt>
                    <dd className="font-semibold">{event.bedrooms}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Bathrooms</dt>
                    <dd className="font-semibold">{event.bathrooms}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Square Feet</dt>
                    <dd className="font-semibold">{formatNumber(event.squareFeet)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
