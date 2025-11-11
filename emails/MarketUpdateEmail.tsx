import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface MarketUpdateEmailProps {
  leadName: string;
  agentName: string;
  agentPhoto: string;
  agentBrokerage: string;
  agentPhone: string;
  agentEmail: string;
  propertyAddress: string;
}

export default function MarketUpdateEmail({
  leadName = 'Guest',
  agentName = 'Your Agent',
  agentPhoto = '',
  agentBrokerage = 'Real Estate Brokerage',
  agentPhone = '',
  agentEmail = '',
  propertyAddress = '123 Main St',
}: MarketUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Local market update and buying insights</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            {agentPhoto && (
              <Img
                src={agentPhoto}
                width="80"
                height="80"
                alt={agentName}
                style={agentImage}
              />
            )}
            <Heading style={h1}>Local Market Update</Heading>
            <Text style={agentInfo}>
              {agentName} • {agentBrokerage}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={paragraph}>Hi {leadName},</Text>
            <Text style={paragraph}>
              I hope you've been well since visiting {propertyAddress}. I wanted to share
              some insights about the current real estate market in the area that might be
              helpful as you continue your home search.
            </Text>

            {/* Market Insights */}
            <Section style={insightBox}>
              <Heading style={insightHeading}>📊 Current Market Trends</Heading>
              <Text style={insightText}>
                • <strong>Inventory:</strong> We're seeing steady inventory levels, giving
                buyers more choices
              </Text>
              <Text style={insightText}>
                • <strong>Interest Rates:</strong> Rates remain favorable for qualified
                buyers
              </Text>
              <Text style={insightText}>
                • <strong>Competition:</strong> Good properties are still receiving
                multiple offers
              </Text>
              <Text style={insightText}>
                • <strong>Time on Market:</strong> Quality homes are selling within 2-3
                weeks
              </Text>
            </Section>

            <Text style={paragraph}>
              <strong>What this means for you:</strong> If you're serious about finding the
              right home, now is a great time to be actively looking. I can help you
              navigate the market and make competitive offers when you find the one.
            </Text>

            {/* Value Proposition */}
            <Section style={valueBox}>
              <Heading style={valueHeading}>How I Can Help</Heading>
              <Text style={valueText}>
                ✓ Access to off-market listings before they're public
                <br />
                ✓ Detailed market analysis and comparable sales data
                <br />
                ✓ Pre-approval connections with trusted lenders
                <br />
                ✓ Negotiation expertise to get you the best deal
                <br />
                ✓ Full support from search to closing
              </Text>
            </Section>

            <Text style={paragraph}>
              Whether you're ready to make a move or still in the research phase, I'm here
              to provide guidance and answer any questions you might have about the home
              buying process.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={`mailto:${agentEmail}?subject=Let's discuss my home search`} style={button}>
                Schedule a Consultation
              </Link>
            </Section>

            {/* Contact Info */}
            <Section style={contactBox}>
              <Text style={contactText}>
                📞 <Link href={`tel:${agentPhone}`} style={contactLink}>{agentPhone}</Link>
              </Text>
              <Text style={contactText}>
                ✉️ <Link href={`mailto:${agentEmail}`} style={contactLink}>{agentEmail}</Link>
              </Text>
            </Section>

            <Text style={signature}>
              I look forward to helping you find your perfect home!
              <br />
              <br />
              {agentName}
              <br />
              {agentBrokerage}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You received this email because you visited one of my open houses. If you'd
              prefer not to receive market updates, please reply and let me know.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 40px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #e6ebf1',
};

const agentImage = {
  borderRadius: '50%',
  margin: '0 auto 16px',
  display: 'block',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '16px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const agentInfo = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '32px 40px',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const insightBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const insightHeading = {
  color: '#166534',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const insightText = {
  color: '#166534',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const valueBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const valueHeading = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const valueText = {
  color: '#1e40af',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const contactBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const contactText = {
  color: '#374151',
  fontSize: '16px',
  margin: '8px 0',
};

const contactLink = {
  color: '#2563eb',
  textDecoration: 'none',
};

const signature = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 0',
};

const footer = {
  padding: '20px 40px',
  borderTop: '1px solid #e6ebf1',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
  textAlign: 'center' as const,
};
