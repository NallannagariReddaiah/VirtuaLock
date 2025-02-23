import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './examinerLogin.css';

function ExaminerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/examiner/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email:email, password:password }),
                credentials: 'include', 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Card.Body>
                    <h2 className="text-center mb-4">Examiner Login</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Form onSubmit={handleSubmit}>
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
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <p>
                            Don't have an account? <Link to="/examiner/signup">Sign Up</Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ExaminerLogin;
