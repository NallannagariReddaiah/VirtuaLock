import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

const FaceDetection = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // fetch("http://localhost:5000/upload-face", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ image: imageSrc }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Face verification result:", data);
    //     if (data.success) {
    //       navigate("/exam/start");
    //     } else {
    //       alert("Face verification failed");
    //     }
    //   });
    navigate("/student/examlist/exam");
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Face Verification</h2>
        <div style={styles.webcamContainer}>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width="100%" height="100%" />
        </div>
        <button style={styles.button} onClick={capture}>
          Capture & Verify
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  card: {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
    width: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "500px",
  },
  heading: {
    marginBottom: "20px",
    color: "#333",
  },
  webcamContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    border: "2px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
  },
};

export default FaceDetection;
