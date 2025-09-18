import { useState, ChangeEvent, FormEvent } from "react";
import * as XLSX from "xlsx";

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  comments: string;
}

interface ExcelRow {
  Name: string;
  Email: string;
  Phone: string;
  Age: string;
  Comments: string;
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    comments: "",
  });

  const [data, setData] = useState<ExcelRow[]>([]);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEntry: ExcelRow = {
      Name: formData.name,
      Email: formData.email,
      Phone: formData.phone,
      Age: formData.age,
      Comments: formData.comments,
    };

    setData((prev) => [...prev, newEntry]);

    setFormData({
      name: "",
      email: "",
      phone: "",
      age: "",
      comments: "",
    });

    alert('Data added successfully! Click "Download Excel" to save.');
  };

  // Download Excel file
  const downloadExcel = () => {
    if (data.length === 0) {
      alert("No data to download!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Form Data");

    XLSX.writeFile(wb, "form_data.xlsx");
  };

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>
        <h2>Submit Your Information</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              min="0"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="comments">Comments</label>
            <textarea
              id="comments"
              name="comments"
              rows={4}
              value={formData.comments}
              onChange={handleChange}
            />
          </div>
          <button type="submit" style={styles.button}>
            Add to Excel
          </button>
        </form>
        <button onClick={downloadExcel} style={{ ...styles.button, marginTop: 10 }}>
          Download Excel
        </button>
      </div>
    </div>
  );
}

// Inline styles (you can move this to a CSS file if needed)
const styles: { [key: string]: React.CSSProperties } = {
  body: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f4f4f4",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  button: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
