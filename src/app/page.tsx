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

// PDF Card Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    width: 300,
    height: 200,
    border: '2px solid #10b981',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 10,
  },
  detail: {
    fontSize: 10,
    marginBottom: 5,
    color: '#333',
  },
  memberId: {
    fontSize: 12,
    color: '#f59e0b',
    marginTop: 10,
  },
});

// PDF Card Component
const MembershipCard = ({ data }: { data: FormData }) => (
  <Document>
    <Page size="A6" style={styles.page}>
      <View>
        <Text style={styles.title}>Pulari Arts and Sports</Text>
        <Text style={styles.title}>Membership Card</Text>
        <Text style={styles.detail}>Name: {data.name}</Text>
        <Text style={styles.detail}>Age: {data.age}</Text>
        <Text style={styles.detail}>Father's Name: {data.fatherName}</Text>
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (formData.age <= 0) newErrors.age = 'Age must be positive';
    if (!formData.fatherName) newErrors.fatherName = "Father's name is required";
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.education) newErrors.education = 'Education is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Data Submitted:', formData); // Mock storage – logs to console for testing
      setSubmitted(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Pulari Arts and Sports</h1>
        <p className="text-center text-gray-600 mb-6">Join our club! Fill the form below.</p>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father&apos;s Name *</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
              {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education *</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Graduate"
                required
              />
              {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
            >
              Submit (Mock – No Payment Yet)
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Welcome, {formData.name}!</h2>
            <p className="text-gray-600 mb-4">Your membership data has been recorded (check console).</p>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <PDFDownloadLink document={<MembershipCard data={formData} />} fileName={`pulari-membership-${formData.name}.pdf`}>
                {({ loading }) => (
                  <button className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200">
                    {loading ? 'Generating...' : 'Download Virtual Card'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', age: 0, fatherName: '', address: '', bloodGroup: '', education: '' });
              }}
              className="text-blue-500 underline"
            >
              Fill Another Form
            </button>
          </div>
        )}
      </div>
    </main>
  );
}