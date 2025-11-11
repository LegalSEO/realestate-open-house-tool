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

interface SimilarPropertiesEmailProps {
  leadName: string;
  agentName: string;
  agentPhoto: string;
  agentBrokerage: string;
  agentPhone: string;
  agentEmail: string;
  propertyAddress: string;
}

export default function SimilarPropertiesEmail({
  leadName = 'Guest',
  agentName = 'Your Agent',
  agentPhoto = '',
  agentBrokerage = 'Real Estate Brokerage',
  agentPhone = '',
  agentEmail = '',
  propertyAddress = '123 Main St',
}: SimilarPropertiesEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Similar properties you might be interested in</Preview>
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
            <Heading style={h1}>Properties You Might Love</Heading>
            <Text style={agentInfo}>
              {agentName} • {agentBrokerage}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={paragraph}>Hi {leadName},</Text>
            <Text style={paragraph}>
              Since you showed interest in {propertyAddress}, I wanted to let you know
              about some similar properties that just hit the market in the same area.
            </Text>
            <Text style={paragraph}>
              These homes share similar features and price points, and they might be exactly
              what you're looking for. I'd love to show you any of these properties or help
              you find something that perfectly matches your needs.
            </Text>

            {/* Info Box */}
            <Section style={infoBox}>
              <Text style={infoText}>
                💡 <strong>Pro Tip:</strong> In the current market, the best properties
                often receive multiple offers within the first few days. If you see
                something you like, let's schedule a showing right away!
              </Text>
            </Section>

            <Text style={paragraph}>
              I have access to properties before they're publicly listed, so if you'd like
              to see what's coming soon to the market, just let me know your preferences and
              I'll send you exclusive early alerts.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={`mailto:${agentEmail}`} style={button}>
                Let's Schedule Showings
              </Link>
            </Section>

            {/* Contact Info */}
            <Section style={contactBox}>
              <Text style={contactText}>
                📞 <Link href={`tel:${agentPhone}`} style={contactLink}>{agentPhone}</Link>
                {' • '}
                ✉️ <Link href={`mailto:${agentEmail}`} style={contactLink}>{agentEmail}</Link>
              </Text>
            </Section>

            <Text style={signature}>
              Looking forward to helping you find your dream home!
              <br />
              <br />
              {agentName}
              <br />
              {agentBrokerage}
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

const infoBox = {
  backgroundColor: '#eff6ff',
  borderLeft: '4px solid #2563eb',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '24px 0',
};

const infoText = {
  color: '#1e40af',
  fontSize: '15px',
  lineHeight: '22px',
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
  padding: '16px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const contactText = {
  color: '#374151',
  fontSize: '14px',
  margin: '0',
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
