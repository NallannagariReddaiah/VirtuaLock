import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown, Form, Button, Card } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

function BasicExample() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditedUser((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const saveChanges = async () => {
    try {
      console.log("edited user",editedUser);
      const response = await fetch(`http://localhost:5000/api/${user.role}/updateMe`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editedUser),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      const updatedUser = await response.json();
      setUser(updatedUser); // Update frontend with new data
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const getDecodedToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("No JWT token found in cookies");
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
      return decoded;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const getUser = async () => {
    try {
      const decoded = getDecodedToken();
      if (!decoded) {
        console.log("Decoded token is null, skipping API call.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/${decoded.role}/getMe`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched user data:", data);

      setUser(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary custom-navbar">
        <Container>
          <Navbar.Brand href="#home">antiCheating</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <NavDropdown title="Login" id="basic-nav-dropdown">
                <NavDropdown.Item href="/student/login">Student</NavDropdown.Item>
                <NavDropdown.Item href="/examiner/login">Examiner</NavDropdown.Item>
              </NavDropdown>
              {user?.role === "examiner" ? (
                <Nav.Link href="/examiner/exam">Post Exam</Nav.Link>
              ) : (
                <Nav.Link href="/student/examlist">Exams</Nav.Link>
              )}
            </Nav>
            <Nav.Link
              className="fw-bold text-primary cursor-pointer"
              onClick={() => {
                setShowProfile(true);
                getUser(); // Ensure fresh data is loaded when profile is opened
              }}
            >
              {user?.username || "Profile"}
            </Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showProfile && (
        <div className="profile-overlay" onClick={() => setShowProfile(false)}>
          <Card className="profile-card" onClick={(e) => e.stopPropagation()}>
            <Card.Body>
              <div className="text-center position-relative">
                <img src={editedUser?.profileImage || "/images/profileimage.png"} alt="Profile" className="profile-img" />
                <label htmlFor="imageUpload" className="camera-icon">
                  <FaCamera />
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />
              </div>
              <h4 className="text-center mt-2">Profile</h4>
              <hr />
              {isEditing ? (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={editedUser?.username || ""}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editedUser?.email || ""}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobileNumber"
                      value={editedUser?.mobileNumber || ""}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button variant="success" onClick={saveChanges}>
                      Save
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>Name:</strong> {user?.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {user?.mobileNumber}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button variant="warning" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setShowProfile(false)}>
                      Close
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .profile-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .profile-card {
          width: 350px; background: white;
          padding: 20px; border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        }
        .profile-img {
          width: 100px; height: 100px; border-radius: 50%;
          object-fit: cover;
          position: relative;
        }
        .camera-icon {
          position: absolute; bottom: 0;
          padding: 5px;
          border-radius: 50%; cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default BasicExample;
