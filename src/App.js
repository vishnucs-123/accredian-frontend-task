import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#6a1b9a" },
    secondary: { main: "#ff6f61" },
  },
});

function App() {
  const [openRefer, setOpenRefer] = useState(false);
  const [formData, setFormData] = useState({
    referrerName: "",
    referrerEmail: "",
    refereeName: "",
    refereeEmail: "",
    courseName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Open and close modal
  const handleOpenRefer = () => setOpenRefer(true);
  const handleCloseRefer = () => setOpenRefer(false);

  // Show information alerts
  const handleOpenInfo = (type) => {
    alert(`Opening ${type} information!`); // Temporary alert
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submission handler
  const handleSubmit = async () => {
    let newErrors = {};
    if (!formData.referrerName) newErrors.referrerName = "Name is required";
    if (!formData.referrerEmail) newErrors.referrerEmail = "Email is required";
    if (!formData.refereeName) newErrors.refereeName = "Friend's name is required";
    if (!formData.refereeEmail) newErrors.refereeEmail = "Friend's email is required";
    if (!formData.courseName) newErrors.courseName = "Course name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/refer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Referral submitted successfully!");
        setOpenRefer(false);
        setFormData({ referrerName: "", referrerEmail: "", refereeName: "", refereeEmail: "", courseName: "" });
        setErrors({});
      } else {
        alert(data.error || "Failed to submit referral");
      }
    } catch (error) {
      console.error("Error submitting referral:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={styles.background}>
        <Container maxWidth="sm">
          <Paper elevation={10} style={styles.card}>
            <Typography variant="h4" style={styles.heading}>Refer & Earn</Typography>
            <Typography variant="body1" style={styles.subheading}>Unlock rewards by referring your friends!</Typography>
            <div style={styles.infoButtons}>
              <Button variant="outlined" color="primary" onClick={() => handleOpenInfo("Benefits")}>Benefits</Button>
              <Button variant="outlined" color="primary" onClick={() => handleOpenInfo("FAQs")}>FAQs</Button>
              <Button variant="outlined" color="primary" onClick={() => handleOpenInfo("Support")}>Support</Button>
            </div>
            <Button variant="contained" color="primary" onClick={handleOpenRefer} style={styles.referButton}>Refer Now</Button>
          </Paper>
        </Container>

        {/* Referral Form Modal */}
        <Dialog open={openRefer} onClose={handleCloseRefer} PaperProps={{ style: styles.modal }}>
          <DialogTitle style={styles.modalTitle}>Refer a Friend</DialogTitle>
          <DialogContent>
            <TextField label="Your Name" name="referrerName" fullWidth variant="outlined"
              value={formData.referrerName} onChange={handleChange} error={!!errors.referrerName} helperText={errors.referrerName} />
            <TextField label="Your Email" name="referrerEmail" fullWidth variant="outlined"
              value={formData.referrerEmail} onChange={handleChange} error={!!errors.referrerEmail} helperText={errors.referrerEmail} />
            <TextField label="Friend's Name" name="refereeName" fullWidth variant="outlined"
              value={formData.refereeName} onChange={handleChange} error={!!errors.refereeName} helperText={errors.refereeName} />
            <TextField label="Friend's Email" name="refereeEmail" fullWidth variant="outlined"
              value={formData.refereeEmail} onChange={handleChange} error={!!errors.refereeEmail} helperText={errors.refereeEmail} />
            <TextField label="Course Name" name="courseName" fullWidth variant="outlined"
              value={formData.courseName} onChange={handleChange} error={!!errors.courseName} helperText={errors.courseName} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRefer} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

// Styles
const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #8e44ad, #ff6f61)",
    color: "white",
    padding: "20px",
  },
  card: {
    padding: "30px",
    textAlign: "center",
    borderRadius: "15px",
  },
  heading: { fontWeight: "bold", marginBottom: "10px" },
  subheading: { marginBottom: "20px" },
  infoButtons: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" },
  referButton: { width: "100%", padding: "10px", fontSize: "16px" },
  modalTitle: { textAlign: "center" },
};

export default App;
