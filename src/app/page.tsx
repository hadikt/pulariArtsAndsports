'use client';

import { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Define the form data type
interface FormData {
  name: string;
  age: number;
  fatherName: string;
  address: string;
  bloodGroup: string;
  education: string;
}

// Replace with your Google Apps Script Web App URL after deploying the script below
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // TODO: Replace with your actual URL

// Google Apps Script Code (Copy this into a new Google Apps Script project and deploy as Web App):
/*
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('1RO8kGJ6sO-T0rwnbBmWCiX9atH-44zxXtHow2oXhVag').getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      data.name,
      data.age,
      data.fatherName,
      data.address,
      data.bloodGroup,
      data.education
    ]);
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
*/
// Deploy instructions: 
// 1. Go to script.google.com, create new project, paste the code.
// 2. Save, then Deploy > New Deployment > Type: Web app > Execute as: Me > Who has access: Anyone.
// 3. Copy the Web app URL and replace GOOGLE_SHEETS_URL above.

// PDF Card Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    width: 350,
    height: 250,
    border: '3px solid #10b981',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 15,
  },
  detail: {
    fontSize: 9,
    marginBottom: 4,
    color: '#333',
    fontFamily: 'Helvetica',
  },
  memberId: {
    fontSize: 10,
    color: '#f59e0b',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

// PDF Card Component
const MembershipCard = ({ data }: { data: FormData }) => (
  <Document>
    <Page size="A6" style={styles.page}>
      <View style={{ alignItems: 'center', width: '100%' }}>
        <Text style={styles.title}>Pulari Arts and Sports</Text>
        <Text style={styles.subtitle}>Membership Card</Text>
        <Text style={styles.detail}>Name: {data.name}</Text>
        <Text style={styles.detail}>Age: {data.age}</Text>
        <Text style={styles.detail}>Father’s Name: {data.fatherName}</Text>
        <Text style={styles.detail}>Address: {data.address}</Text>
        <Text style={styles.detail}>Blood Group: {data.bloodGroup}</Text>
        <Text style={styles.detail}>Education: {data.education}</Text>
        <Text style={styles.memberId}>ID: {Date.now()} (Virtual)</Text>
      </View>
    </Page>
  </Document>
);

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: 0,
    fatherName: '',
    address: '',
    bloodGroup: '',
    education: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.age <= 0 || isNaN(formData.age)) newErrors.age = 'Age must be a positive number';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father’s name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.education.trim()) newErrors.education = 'Education is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToGoogleSheets = async (data: FormData) => {
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('Data saved to Google Sheets');
      return true;
    } catch (error: any) {
      console.error('Error saving to Google Sheets:', error.message);
      throw new Error(`Failed to save to Google Sheets: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (validate()) {
      setLoading(true);
      try {
        await saveToGoogleSheets(formData);
        console.log('Form Data Submitted:', formData);
        setSubmitted(true);
      } catch (error: any) {
        setSubmitError(error.message || 'Failed to save data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-auto transform transition-all duration-300 hover:scale-[1.02]">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
            Pulari Arts and Sports
          </h1>
          <p className="text-gray-600">Join our vibrant club! Fill the form below to get started.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="Enter your full name"
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="Enter your age"
                required
              />
              {errors.age && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Father’s Name *</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="Enter father’s full name"
                required
              />
              {errors.fatherName && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.fatherName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="Enter your full address"
                required
              />
              {errors.address && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white"
                required
              >
                <option value="">Select your blood group...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.bloodGroup && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.bloodGroup}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Education *</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="e.g., Bachelor’s Degree"
                required
              />
              {errors.education && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.education}</p>}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-pulse">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-600 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Submit (Mock – No Payment Yet)</span>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h2 className="text-2xl font-bold text-green-600 mb-2">Welcome, {formData.name}! 🎉</h2>
              <p className="text-gray-600">Your membership data has been successfully saved to Google Sheets (check console for details).</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <PDFDownloadLink document={<MembershipCard data={formData} />} fileName={`pulari-membership-${formData.name}.pdf`}>
                {({ loading }) => (
                  <button className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-500 transition duration-200 font-semibold w-full">
                    {loading ? 'Generating PDF...' : 'Download Your Virtual Card'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', age: 0, fatherName: '', address: '', bloodGroup: '', education: '' });
                setErrors({});
                setSubmitError('');
              }}
              className="text-blue-500 hover:text-blue-600 underline font-medium transition duration-200"
            >
              Fill Another Form
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </main>
  );
}