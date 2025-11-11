export type LeadScore = 'HOT' | 'WARM' | 'COLD'

export interface LeadData {
  preApproved: string // 'yes' | 'no' | 'not-sure'
  hasAgent: boolean
  timeline: string // '0-30 days' | '1-3 months' | '3-6 months' | '6+ months'
}

export function calculateLeadScore(lead: LeadData): LeadScore {
  let score = 0

  // Check criteria for HOT lead
  if (lead.preApproved === 'yes') score++
  if (!lead.hasAgent) score++
  if (lead.timeline === '0-30 days') score++

  // HOT: All 3 criteria met
  if (score === 3) return 'HOT'

  // WARM: 2 out of 3 criteria met
  if (score === 2) return 'WARM'

  // COLD: Everything else (0-1 criteria met)
  return 'COLD'
}
