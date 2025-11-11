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

interface WelcomeEmailProps {
  leadName: string;
  agentName: string;
  agentPhoto: string;
  agentBrokerage: string;
  propertyAddress: string;
  propertyPhotos: string[];
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyLink: string;
}

export default function WelcomeEmail({
  leadName = 'Guest',
  agentName = 'Your Agent',
  agentPhoto = '',
  agentBrokerage = 'Real Estate Brokerage',
  propertyAddress = '123 Main St',
  propertyPhotos = [],
  price = 500000,
  bedrooms = 3,
  bathrooms = 2,
  squareFeet = 2000,
  propertyLink = '#',
}: WelcomeEmailProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);

  return (
    <Html>
      <Head />
      <Preview>Thank you for visiting {propertyAddress} today!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Agent Info */}
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
            <Heading style={h1}>Thank You for Visiting!</Heading>
            <Text style={agentInfo}>
              {agentName} • {agentBrokerage}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={paragraph}>Hi {leadName},</Text>
            <Text style={paragraph}>
              Thank you for taking the time to visit the open house at{' '}
              <strong>{propertyAddress}</strong> today. It was great meeting you!
            </Text>

            {/* Property Photos */}
            {propertyPhotos.length > 0 && (
              <Section style={photoGrid}>
                {propertyPhotos.slice(0, 4).map((photo, index) => (
                  <Img
                    key={index}
                    src={photo}
                    alt={`Property photo ${index + 1}`}
                    style={propertyPhoto}
                  />
                ))}
              </Section>
            )}

            {/* Property Details */}
            <Section style={propertyDetails}>
              <Heading style={h2}>{propertyAddress}</Heading>
              <Text style={price}>{formattedPrice}</Text>
              <Text style={specs}>
                {bedrooms} Beds • {bathrooms} Baths • {squareFeet.toLocaleString()} sq ft
              </Text>
            </Section>

            <Text style={paragraph}>
              I've included all the property details and photos for your review. Feel free
              to share this with family or friends who might be interested.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={propertyLink} style={button}>
                View Full Property Details
              </Link>
            </Section>

            <Text style={paragraph}>
              If you have any questions or would like to schedule a private showing, please
              don't hesitate to reach out. I'm here to help you find your perfect home!
            </Text>

            <Text style={signature}>
              Best regards,
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

const photoGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  margin: '24px 0',
};

const propertyPhoto = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
};

const propertyDetails = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const price = {
  color: '#059669',
  fontSize: '24px',
  fontWeight: '700',
  margin: '8px 0',
};

const specs = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '8px 0 0',
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

const signature = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 0',
};
