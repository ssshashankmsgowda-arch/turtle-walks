import { UserData, FIXED_PLEDGE } from '../types';

// In a real scenario, this would be your Google Apps Script Web App URL
// Google Apps Script Web App URL provided by the user
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_zgKvm1Pi4M3-kATr7wf_G2rYaVkIoUxfLTyQ8n4KXSuYt45Ot-dKxmR9qUNfJXhYbw/exec';

export const saveUserData = async (userData: UserData): Promise<boolean> => {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      fullName: userData.fullName,
      email: userData.email,
      phone: `${userData.countryCode}${userData.phone}`,
      pledge: FIXED_PLEDGE.text,
      photoStatus: userData.photo ? 'Uploaded' : 'None'
    };

    // Send data to Google Sheets via Google Apps Script
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Apps Script
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return true;

    return true;
  } catch (error) {
    console.error('Error saving pledge:', error);
    return false;
  }
};