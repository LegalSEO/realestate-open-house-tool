import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone } from "lucide-react"

interface AgentCardProps {
  name: string
  photo: string
  brokerage: string
  email: string
  phone: string
}

export function AgentCard({ name, photo, brokerage, email, phone }: AgentCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-semibold">{name}</h3>
            <p className="text-sm md:text-base text-muted-foreground">{brokerage}</p>
            <div className="flex flex-col md:flex-row md:gap-4 mt-2 text-sm">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Mail className="w-4 h-4" />
                {email}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
