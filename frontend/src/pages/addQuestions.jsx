import React, { useState } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import { FaFileUpload, FaPlusCircle, FaCheckCircle, FaQuestionCircle, FaListOl, FaPenAlt, FaUpload } from "react-icons/fa";
import "./AddQuestions.css"; // Custom CSS file for styling
import axios from "axios"
import { useParams } from "react-router-dom";

const AddQuestions = () => {
  const {examId} =useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    correctAnswer: "",
    marks: "",
    type: "MCQ",
    options: ["", "", "", ""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const addQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ questionText: "", correctAnswer: "", marks: "", type: "MCQ", options: ["", "", "", ""] });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      const formattedQuestions = parsedData.map((q) => ({
        questionText: q.questionText || "",
        correctAnswer: q.correctAnswer || "",
        marks: q.marks || "",
        type: q.type || "MCQ",
        options: q.type === "MCQ" ? [q.option1 || "", q.option2 || "", q.option3 || "", q.option4 || ""] : [],
      }));
      setQuestions(formattedQuestions);
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePostExam = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/examiner/add-questions",
        {
          questions:questions,
          examId:examId,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.status == 200) {
        throw new Error(response.data.message || "Failed to create exam");
      }

      setLoading(false);
      navigate("/examiner/exam/addquestions");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <Container className="my-5">
      <Card className="add-questions-card">
        <Card.Body>
          <h2 className="text-center mb-4">
            <FaQuestionCircle className="form-icon" /> Add Questions
          </h2>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>
                <FaPenAlt className="form-icon" /> Question Text
              </Form.Label>
              <Form.Control
                type="text"
                name="questionText"
                value={newQuestion.questionText}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaCheckCircle className="form-icon" /> Marks
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="marks"
                    value={newQuestion.marks}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaListOl className="form-icon" /> Question Type
                  </Form.Label>
                  <Form.Select name="type" value={newQuestion.type} onChange={handleChange}>
                    <option value="MCQ">MCQ</option>
                    <option value="Subjective">Subjective</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {newQuestion.type === "MCQ" &&
              newQuestion.options.map((option, index) => (
                <Form.Group key={index} className="mb-3">
                  <Form.Label>Option {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                </Form.Group>
              ))}
            <Form.Group className="mb-4">
              <Form.Label>
                <FaCheckCircle className="form-icon" /> Correct Answer
              </Form.Label>
              <Form.Control
                type="text"
                name="correctAnswer"
                value={newQuestion.correctAnswer}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-center mt-4">
              <Button variant="success" onClick={addQuestion} className="btn-lg px-5">
                <FaPlusCircle className="me-2" /> Add Question
              </Button>
            </div>
          </Form>
          <hr className="my-4" />
          <h4 className="text-center mb-4">
            <FaUpload className="form-icon" /> OR Upload Excel File
          </h4>
          <Form.Group className="mb-4">
            <Form.Control
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </Form.Group>
          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" onClick={handlePostExam} className="btn-lg px-5">
              <FaFileUpload className="me-2" /> Post Exam
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddQuestions;