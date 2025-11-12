import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateLeadScore } from "@/lib/lead-scoring"
import { sendWelcomeMessages, scheduleFollowUpSequence } from "@/lib/messaging"
import { triggerNewLead } from "@/lib/pusher-server"

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

    // Trigger real-time notification via Pusher
    triggerNewLead(eventId, lead).catch((error) => {
      console.error("Failed to trigger real-time notification:", error)
      // Don't throw - we don't want to fail the lead creation
    })

    // Send immediate welcome messages (SMS + Email)
    // This is done in a non-blocking way so it doesn't delay the response
    sendWelcomeMessages(lead.id, eventId).catch((error) => {
      console.error("Failed to send welcome messages:", error)
      // Don't throw - we don't want to fail the lead creation
    })

    // Schedule follow-up messages
    // 1 hour, 24 hours, 3 days, and 7 days later
    scheduleFollowUpSequence(lead.id, eventId).catch((error) => {
      console.error("Failed to schedule follow-up messages:", error)
      // Don't throw - we don't want to fail the lead creation
    })

    return NextResponse.json({ success: true, lead }, { status: 201 })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    )
  }
}
