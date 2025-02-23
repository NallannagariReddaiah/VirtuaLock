import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './examinerSignup.css';

function ExaminerSignup() {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/examiner/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username:name,email:email,password:password,mobileNumber:mobile}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            setSuccess('Signup successful! Redirecting to login...');
            setTimeout(() => navigate(''), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Card.Body>
                    <h2 className="text-center mb-4">Examiner Signup</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    {success && <p className="text-success text-center">{success}</p>}
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
                        <Form.Group className="mb-3" controlId="formGroupPassword">
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
                            Already have an account? <Link to="/examiner/login">Login</Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ExaminerSignup;
