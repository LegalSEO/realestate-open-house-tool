import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateLeadScore } from "@/lib/lead-scoring"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      eventId,
      firstName,
      lastName,
      email,
      phone,
      preApproved,
      hasAgent,
      timeline,
      interestedIn,
    } = body

    // Calculate lead score
    const score = calculateLeadScore({
      preApproved,
      hasAgent,
      timeline,
    })

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        openHouseEventId: eventId,
        firstName,
        lastName,
        email,
        phone,
        preApproved,
        hasAgent,
        timeline,
        interestedIn,
        score,
      },
    })

    // TODO: In the next prompt, we'll implement:
    // - Instant SMS notification to agent
    // - Email notification to agent
    // - Email confirmation to lead

    return NextResponse.json({ success: true, lead }, { status: 201 })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    )
  }
}
