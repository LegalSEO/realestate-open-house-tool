import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1F2937',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrCode: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  urlContainer: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    alignItems: 'center',
  },
  urlLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  url: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 20,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  agentSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  agentDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 3,
  },
});

interface SignInSheetPDFProps {
  qrCodeDataUrl: string;
  signInUrl: string;
  propertyAddress: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agentBrokerage: string;
  eventDate: string;
}

export const SignInSheetPDF: React.FC<SignInSheetPDFProps> = ({
  qrCodeDataUrl,
  signInUrl,
  propertyAddress,
  agentName,
  agentPhone,
  agentEmail,
  agentBrokerage,
  eventDate,
}) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Scan to Sign In</Text>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <Image src={qrCodeDataUrl} style={styles.qrCode} />
      </View>

      {/* URL */}
      <View style={styles.urlContainer}>
        <Text style={styles.urlLabel}>Or visit:</Text>
        <Text style={styles.url}>{signInUrl}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Property Information */}
      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Property Address</Text>
        <Text style={styles.infoValue}>{propertyAddress}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Open House Date</Text>
        <Text style={styles.infoValue}>{eventDate}</Text>
      </View>

      {/* Agent Information */}
      <View style={styles.agentSection}>
        <Text style={styles.agentName}>{agentName}</Text>
        <Text style={styles.agentDetails}>{agentBrokerage}</Text>
        <Text style={styles.agentDetails}>Phone: {agentPhone}</Text>
        <Text style={styles.agentDetails}>Email: {agentEmail}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Scan the QR code above with your smartphone camera to sign in and view property details
        </Text>
      </View>
    </Page>
  </Document>
);
