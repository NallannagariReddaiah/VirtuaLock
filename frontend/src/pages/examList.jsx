import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaGlobe,
  FaLock,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";

const ExamList = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);

  const handleExam = (examId) => {
    navigate(`exam/${examId}`);
  };
  const getExams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/student/exams",
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        setExams(response.data.exams);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getExams();
  }, []);
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 fw-bold text-primary">Available Exams</h2>
      <Row className="g-4">
        {exams.map((exam) => (
          <Col key={exam._id} md={6} lg={4}>
            <Card
              className="shadow-sm exam-card p-3"
              onClick={() => handleExam(exam._id)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between">
                {exam.examType === "public" ? (
                  <FaGlobe size={25} color="#0d6efd" />
                ) : (
                  <FaLock size={25} color="#dc3545" />
                )}
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip id={`tooltip-${exam.id}`}>
                      {exam.description}
                    </Tooltip>
                  }
                  trigger={["hover", "focus"]}
                >
                  <span>
                    <FaInfoCircle
                      size={22}
                      color="#ffc107"
                      className="info-icon"
                    />
                  </span>
                </OverlayTrigger>
              </div>

              <Card.Body className="text-center">
                <h5 className="fw-bold text-dark exam-title">{exam.title}</h5>

                <ProgressBar
                  now={Math.max(
                    0,
                    Math.min(
                      100,
                      ((new Date(exam.endTime) - new Date()) /
                        (new Date(exam.endTime) - new Date(exam.startTime))) *
                        100
                    )
                  )}
                  variant={
                    new Date() < new Date(exam.endTime) ? "success" : "danger"
                  }
                  className="progress-bar-custom my-2"
                  style={{ height: "6px" }}
                />

                <p
                  className={`validity-text ${
                    new Date() < new Date(exam.endTime)
                      ? "text-success"
                      : "text-danger"
                  } fw-bold`}
                >
                  {new Date() < new Date(exam.endTime)
                    ? `${Math.max(
                        0,
                        Math.min(
                          100,
                          (
                            ((new Date(exam.endTime) - new Date()) /
                              (new Date(exam.endTime) -
                                new Date(exam.startTime))) *
                            100
                          ).toFixed(0)
                        )
                      )}% Valid`
                    : "Validity Expired"}
                </p>

                <div className="exam-details">
                  <div className="d-flex justify-content-between">
                    <div className="detail-item">
                      <FaClipboardList className="icon text-primary" />
                      <div>
                        <p className="value">1</p>
                        <p className="label">Assessment</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaClipboardList className="icon text-primary" />
                      <div>
                        <p className="value">---</p>
                        <p className="label">Practice Test</p>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <div className="detail-item">
                      <FaCalendarAlt className="icon text-primary" />
                      <div>
                        <p className="value">
                          {new Date(exam.startTime).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p className="label">Start Date</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaCalendarAlt className="icon text-primary" />
                      <div>
                        <p className="value">
                          {new Date(exam.endTime).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p className="label">End Date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <style>{`
        .exam-card {
          border-radius: 14px;
          background: #ffffff;
          color: #333;
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          min-height: 320px;
        }
        .exam-card:hover {
          transform: scale(1.03);
          box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
        }
        .exam-title {
          font-size: 16px;
          margin-top: 8px;
          min-height: 40px;
        }
        .progress-bar-custom {
          height: 6px !important;
        }
        .validity-text {
          font-size: 12px;
          margin-top: -5px;
        }
        .exam-details {
          font-size: 14px;
          background: rgba(0, 0, 0, 0.03);
          padding: 10px;
          border-radius: 8px;
          margin-top: 10px;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .detail-item .icon {
          font-size: 18px;
        }
        .detail-item .value {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 0;
        }
        .detail-item .label {
          font-size: 11px;
          color: #666;
          margin-bottom: 0;
        }
        .info-icon {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
};

export default ExamList;
