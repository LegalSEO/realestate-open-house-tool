"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface PropertyHeroProps {
  photos: string[]
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  welcomeMessage: string
}

export function PropertyHero({
  photos,
  address,
  price,
  bedrooms,
  bathrooms,
  squareFeet,
  welcomeMessage,
}: PropertyHeroProps) {
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

  return (
    <div className="bg-white">
      {/* Photo Carousel */}
      <div className="w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {photos.map((photo, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-[300px] md:h-[500px]">
                  <Image
                    src={photo}
                    alt={`${address} - Photo ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {photos.length > 1 && (
            <>
              <div className="hidden md:block">
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </div>
            </>
          )}
        </Carousel>
      </div>

      {/* Property Info */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">{address}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-sm md:text-base px-3 py-1">
            {formatPrice(price)}
          </Badge>
          <Badge variant="outline" className="text-sm md:text-base px-3 py-1">
            {bedrooms} bed
          </Badge>
          <Badge variant="outline" className="text-sm md:text-base px-3 py-1">
            {bathrooms} bath
          </Badge>
          <Badge variant="outline" className="text-sm md:text-base px-3 py-1">
            {formatNumber(squareFeet)} sqft
          </Badge>
        </div>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {welcomeMessage}
        </p>
      </div>
    </div>
  )
}
