'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    fatherName: '',
    address: '',
    bloodGroup: '',
    education: '',
    paymentConfirmed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [membershipId, setMembershipId] = useState('');

  // ✅ Paste YOUR Google Apps Script Web App URL here
  const GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzBZJFCydEm-phASF1y5uDgdcMXhHjJC5jigZfSF4_wsDK5yjvdpPbEnMy7otGvsrYc/exec';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateMembershipId = () => 'PUL' + Date.now().toString().slice(-6);

  const generateCard = async (data: typeof formData, id: string) => {
    const cardHtml = `
      <div style="width: 350px; height: 200px; border: 2px solid #10b981; border-radius: 10px; padding: 20px; background: linear-gradient(135deg, #10b981, #3b82f6); color: white; font-family: Arial, sans-serif; position: relative;">
        <h2 style="text-align: center; margin: 0 0 10px 0; font-size: 24px;">Pulari Arts & Sports Club</h2>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Member ID:</strong> ${id}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Name:</strong> ${data.name}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Age:</strong> ${data.age}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Father's Name:</strong> ${data.fatherName}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Blood Group:</strong> ${data.bloodGroup}</p>
        <div style="position: absolute; bottom: 10px; right: 10px; font-size: 10px; opacity: 0.8;">Valid from: ${new Date().toLocaleDateString()}</div>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHtml;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(tempDiv, { scale: 2 });
    document.body.removeChild(tempDiv);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a6');
    const imgWidth = 148;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${data.name}_Membership_Card.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.paymentConfirmed) {
      alert('Please confirm payment of 50 Rs.');
      return;
    }

    setIsSubmitting(true);
    const id = generateMembershipId();
    setMembershipId(id);

    try {
      // ✅ Save to Google Sheets (no backend needed)
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, membershipId: id }),
      });

      if (!response.ok) throw new Error('Failed to save data.');

      // ✅ Generate Membership Card
      await generateCard(formData, id);

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      alert('There was an error saving your data. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
            Welcome to Pulari Arts & Sports!
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Your membership card has been downloaded. Membership ID:{' '}
            <strong>{membershipId}</strong>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Join Another Member
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">
            Pulari Arts & Sports Club
          </h1>
          <p className="text-gray-600 mt-2">
            Join us today! Membership Fee: 50 Rs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="100"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father&apos;s Name
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Education
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="e.g., B.Sc, High School"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Payment Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="paymentConfirmed"
              checked={formData.paymentConfirmed}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              I confirm payment of 50 Rs (via UPI/Cash)
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 font-semibold"
          >
            {isSubmitting ? 'Processing...' : 'Submit & Get Membership Card'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your data is saved securely in Google Sheets and a membership card
          will be downloaded!
        </p>
      </div>
    </div>
  );
}
