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

interface FollowUpEmailProps {
  leadName: string;
  agentName: string;
  agentPhoto: string;
  agentBrokerage: string;
  agentPhone: string;
  agentEmail: string;
  propertyAddress: string;
  propertyLink: string;
  followUpNumber: number; // 1 for first follow-up, 2 for second
}

export default function FollowUpEmail({
  leadName = 'Guest',
  agentName = 'Your Agent',
  agentPhoto = '',
  agentBrokerage = 'Real Estate Brokerage',
  agentPhone = '',
  agentEmail = '',
  propertyAddress = '123 Main St',
  propertyLink = '#',
  followUpNumber = 1,
}: FollowUpEmailProps) {
  const getContent = () => {
    if (followUpNumber === 1) {
      return {
        preview: `Following up about ${propertyAddress}`,
        mainText: `I wanted to follow up and see if you had any questions about the property at ${propertyAddress}. I know it can be hard to remember all the details during a showing, so I'm happy to answer any questions that have come up since your visit.`,
        additionalText: `Are you interested in scheduling a second showing? Sometimes it helps to see a property again, especially with family members or friends whose opinions matter to you.`,
      };
    } else {
      return {
        preview: `Still thinking about ${propertyAddress}?`,
        mainText: `I wanted to reach out one more time about the property at ${propertyAddress}. I know finding the right home is a big decision that takes time and consideration.`,
        additionalText: `If you're still interested or have any questions, I'd love to help. I can provide you with comparable sales data, neighborhood information, or schedule another showing at your convenience.`,
      };
    }
  };

  const content = getContent();

  return (
    <Html>
      <Head />
      <Preview>{content.preview}</Preview>
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
            <Text style={agentInfo}>
              <strong>{agentName}</strong>
              <br />
              {agentBrokerage}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={paragraph}>Hi {leadName},</Text>
            <Text style={paragraph}>{content.mainText}</Text>
            <Text style={paragraph}>{content.additionalText}</Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={propertyLink} style={button}>
                View Property Details
              </Link>
            </Section>

            <Text style={paragraph}>
              Feel free to reach out anytime. I'm here to help make your home buying
              journey as smooth as possible.
            </Text>

            {/* Contact Info */}
            <Section style={contactBox}>
              <Heading style={contactHeading}>Get in Touch</Heading>
              <Text style={contactText}>
                📞 <Link href={`tel:${agentPhone}`} style={contactLink}>{agentPhone}</Link>
              </Text>
              <Text style={contactText}>
                ✉️ <Link href={`mailto:${agentEmail}`} style={contactLink}>{agentEmail}</Link>
              </Text>
            </Section>

            <Text style={signature}>
              Best regards,
              <br />
              {agentName}
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

const agentInfo = {
  color: '#374151',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
  lineHeight: '24px',
};

const contentSection = {
  padding: '32px 40px',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
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
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const contactHeading = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
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
