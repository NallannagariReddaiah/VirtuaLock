import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaLock,
  FaFileAlt,
} from "react-icons/fa";
import "./ExamForm.css";
import axios from "axios";

const ExamForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    duration: "",
    startTime: "",
    endTime: "",
    examType: "public", // Default value
    securityFeatures: {
      faceVerification: true,
      livenessDetection: true,
      multipleFaceDetection: true,
      smartDeviceDetection: true,
      noiseDetection: true,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setExamData((prev) => ({
        ...prev,
        securityFeatures: { ...prev.securityFeatures, [name]: checked },
      }));
    } else {
      setExamData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/examiner/create-exam",
        examData,
        {
          withCredentials: true,
        }
      );

      if (!response.status == 200) {
        throw new Error(response.data.message || "Failed to create exam");
      }

      setLoading(false);
      navigate(`/examiner/exam/addquestions/${response.data.exam._id}`);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Card className="exam-form-card">
        <Card.Body>
          <h2 className="text-center mb-4">Create Exam</h2>
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>
                <FaUser className="form-icon" /> Title
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={examData.title}
                onChange={handleChange}
                className="form-control-lg"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                <FaFileAlt className="form-icon" /> Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={examData.description}
                onChange={handleChange}
                className="form-control-lg"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaClock className="form-icon" /> Duration (minutes)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={examData.duration}
                    onChange={handleChange}
                    className="form-control-lg"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaCalendarAlt className="form-icon" /> Start Time
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startTime"
                    value={examData.startTime}
                    onChange={handleChange}
                    className="form-control-lg"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaCalendarAlt className="form-icon" /> End Time
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endTime"
                    value={examData.endTime}
                    onChange={handleChange}
                    className="form-control-lg"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <h5 className="mt-4 mb-3">Exam Type</h5>
                <Form.Check
                  type="radio"
                  label="Public"
                  name="examType"
                  value="public"
                  checked={examData.examType === "public"}
                  onChange={handleChange}
                  className="mb-3"
                />
                <Form.Check
                  type="radio"
                  label="Private"
                  name="examType"
                  value="private"
                  checked={examData.examType === "private"}
                  onChange={handleChange}
                  className="mb-3"
                />
              </Col>
            </Row>

            <h5 className="mt-4 mb-3">
              <FaLock className="form-icon" /> Security Features
            </h5>
            <Form.Check
              type="checkbox"
              label="Face Verification"
              name="faceVerification"
              checked={examData.securityFeatures.faceVerification}
              onChange={handleChange}
              className="mb-3"
            />
            <Form.Check
              type="checkbox"
              label="Liveness Detection"
              name="livenessDetection"
              checked={examData.securityFeatures.livenessDetection}
              onChange={handleChange}
              className="mb-3"
            />
            <Form.Check
              type="checkbox"
              label="Multiple Face Detection"
              name="multipleFaceDetection"
              checked={examData.securityFeatures.multipleFaceDetection}
              onChange={handleChange}
              className="mb-3"
            />
            <Form.Check
              type="checkbox"
              label="Smart Device Detection"
              name="smartDeviceDetection"
              checked={examData.securityFeatures.smartDeviceDetection}
              onChange={handleChange}
              className="mb-3"
            />
            <Form.Check
              type="checkbox"
              label="Noise Detection"
              name="noiseDetection"
              checked={examData.securityFeatures.noiseDetection}
              onChange={handleChange}
              className="mb-3"
            />

            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="primary"
                type="submit"
                className="btn-lg px-5"
                disabled={loading}
              >
                {loading ? "Processing..." : "Next"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExamForm;
