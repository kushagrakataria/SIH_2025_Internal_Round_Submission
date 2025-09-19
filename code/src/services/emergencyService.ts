import databaseService from './databaseService';
import authService from './authService';

// Emergency Services
export interface EmergencyData {
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  emergencyType: 'SOS_BUTTON' | 'AUTO_DETECT' | 'GEOFENCE_VIOLATION' | 'PANIC_BUTTON';
  userId: string;
  digitalId: string;
  additionalInfo?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
}

export class EmergencyService {
  private static instance: EmergencyService;
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  static getInstance(): EmergencyService {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService();
    }
    return EmergencyService.instance;
  }

  async sendEmergencyAlert(data: EmergencyData): Promise<boolean> {
    try {
      // Create emergency incident in Firebase
      const incidentData = {
        userId: data.userId,
        digitalId: data.digitalId,
        location: data.location,
        timestamp: data.timestamp,
        type: data.emergencyType,
        severity: data.severity || 'high',
        status: 'active' as const,
        description: data.additionalInfo,
        notifiedContacts: [],
        address: await this.getAddressFromCoordinates(data.location.lat, data.location.lng)
      };

      const incidentId = await databaseService.createEmergencyIncident(incidentData);

      // Get user's emergency contacts
      const userProfile = await authService.getCurrentUserProfile();
      const emergencyContacts = userProfile?.emergencyContacts || [];

      // Send notifications to emergency contacts
      await this.notifyEmergencyContacts(data, emergencyContacts);

      // Update incident with notified contacts
      await databaseService.updateEmergencyIncident(incidentId, {
        notifiedContacts: emergencyContacts.map(contact => contact.id)
      });

      // Log incident locally for offline support
      this.logIncidentLocally(data);

      return true;
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      
      // Store for retry if network is unavailable
      this.storeForRetry(data);
      
      // Still notify contacts if possible
      try {
        const userProfile = await authService.getCurrentUserProfile();
        const emergencyContacts = userProfile?.emergencyContacts || [];
        await this.notifyEmergencyContacts(data, emergencyContacts);
      } catch (contactError) {
        console.error('Failed to notify emergency contacts:', contactError);
      }
      
      return false;
    }
  }

  private async notifyEmergencyContacts(
    data: EmergencyData, 
    contacts: Array<{ id: string; name: string; phone: string; email?: string; relationship: string; isPrimary: boolean }>
  ): Promise<void> {
    const message = this.createEmergencyMessage(data);

    for (const contact of contacts) {
      try {
        // In production, integrate with SMS service (Twilio, etc.)
        await this.sendSMS(contact.phone, message);
        
        if (contact.email) {
          await this.sendEmail(contact.email, 'Emergency Alert', message);
        }
      } catch (error) {
        console.error(`Failed to notify ${contact.name}:`, error);
      }
    }
  }

  private async getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    try {
      // Use Google Maps Geocoding API or similar service
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].formatted_address;
        }
      }
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  private createEmergencyMessage(data: EmergencyData): string {
    const user = this.getCurrentUser();
    const locationUrl = `https://maps.google.com/maps?q=${data.location.lat},${data.location.lng}`;
    
    return `🚨 EMERGENCY ALERT 🚨\n\n` +
           `${user.name} has triggered an emergency alert.\n\n` +
           `Time: ${new Date(data.timestamp).toLocaleString()}\n` +
           `Location: ${locationUrl}\n` +
           `Digital ID: ${data.digitalId}\n\n` +
           `Please check on them immediately or contact local authorities if needed.\n\n` +
           `This is an automated message from Tourist Safety App.`;
  }

  private async sendSMS(phone: string, message: string): Promise<void> {
    // Integration with SMS service would go here
    // For demo, we'll just log
    console.log(`SMS to ${phone}: ${message}`);
    
    // Example Twilio integration:
    /*
    const response = await fetch(`${this.apiUrl}/api/sms/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phone, message }),
    });
    */
  }

  private async sendEmail(email: string, subject: string, message: string): Promise<void> {
    // Integration with email service would go here
    console.log(`Email to ${email}: ${subject} - ${message}`);
  }

  private logIncidentLocally(data: EmergencyData): void {
    const incidents = JSON.parse(localStorage.getItem('emergency_incidents') || '[]');
    incidents.push({
      ...data,
      id: `incident_${Date.now()}`,
      status: 'sent',
      createdAt: new Date().toISOString(),
    });
    
    // Keep only last 50 incidents
    if (incidents.length > 50) {
      incidents.splice(0, incidents.length - 50);
    }
    
    localStorage.setItem('emergency_incidents', JSON.stringify(incidents));
  }

  private storeForRetry(data: EmergencyData): void {
    const pending = JSON.parse(localStorage.getItem('pending_emergencies') || '[]');
    pending.push({
      ...data,
      id: `pending_${Date.now()}`,
      retryCount: 0,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('pending_emergencies', JSON.stringify(pending));
  }

  async retryPendingAlerts(): Promise<void> {
    const pending = JSON.parse(localStorage.getItem('pending_emergencies') || '[]');
    const remaining = [];

    for (const alert of pending) {
      if (alert.retryCount < 3) {
        try {
          const success = await this.sendEmergencyAlert(alert);
          if (!success) {
            alert.retryCount++;
            remaining.push(alert);
          }
        } catch (error) {
          alert.retryCount++;
          remaining.push(alert);
        }
      }
    }

    localStorage.setItem('pending_emergencies', JSON.stringify(remaining));
  }

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/user/emergency-contacts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch emergency contacts:', error);
    }

    // Fallback to local storage
    return JSON.parse(localStorage.getItem('emergency_contacts') || '[]');
  }

  async addEmergencyContact(contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
    const newContact = {
      ...contact,
      id: `contact_${Date.now()}`,
    };

    try {
      const response = await fetch(`${this.apiUrl}/api/user/emergency-contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(newContact),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to add emergency contact:', error);
    }

    // Fallback to local storage
    const contacts = await this.getEmergencyContacts();
    contacts.push(newContact);
    localStorage.setItem('emergency_contacts', JSON.stringify(contacts));
    
    return newContact;
  }

  private getCurrentUser() {
    // This would come from auth context in a real app
    return {
      id: 'user_123',
      name: 'John Doe',
      digitalId: 'TST2024001',
    };
  }

  // Blockchain-style incident logging
  async logIncidentToBlockchain(data: EmergencyData): Promise<string> {
    const incident = {
      ...data,
      blockNumber: Date.now(),
      previousHash: await this.getLastBlockHash(),
      hash: '',
    };

    // Create hash (simplified version of blockchain concept)
    incident.hash = await this.createHash(JSON.stringify(incident));

    try {
      const response = await fetch(`${this.apiUrl}/api/blockchain/incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(incident),
      });

      if (response.ok) {
        const result = await response.json();
        return result.hash;
      }
    } catch (error) {
      console.error('Failed to log to blockchain:', error);
    }

    return incident.hash;
  }

  private async getLastBlockHash(): Promise<string> {
    // Get the hash of the last block in the chain
    const stored = localStorage.getItem('last_block_hash');
    return stored || '0000000000000000000000000000000000000000000000000000000000000000';
  }

  private async createHash(data: string): Promise<string> {
    // Simple hash function for demo (in production, use proper cryptographic hash)
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}