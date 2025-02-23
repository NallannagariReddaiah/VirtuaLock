import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './studentSignup.css';

function StudentSignup() {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !mobile || !email || !password) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/student/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username:name, mobileNumber:mobile, email, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            localStorage.setItem('token', data.token);
            navigate('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Card.Body>
                    <h2 className="text-center mb-4">Student Signup</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formGroupName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupMobileNo">
                            <Form.Label>Mobile No</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter mobile no"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 password-group" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <div className="password-wrapper">
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="toggle-icon" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Signup
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <p>
                            Already have an account? <Link to="/student/login">Login</Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default StudentSignup;
