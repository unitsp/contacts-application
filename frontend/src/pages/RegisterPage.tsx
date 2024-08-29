import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Utility function for form validation
const validateForm = (formState: any) => {
    const newErrors: { [key: string]: string } = {};
    if (!formState.name) newErrors.name = 'Name is required';
    if (!formState.email) newErrors.email = 'Email is required';
    if (!formState.password) newErrors.password = 'Password is required';
    if (formState.password !== formState.passwordConfirmation) newErrors.passwordConfirmation = 'Passwords do not match';
    return newErrors;
};

const FormField: React.FC<{
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}> = ({ id, label, type = 'text', value, onChange, error }) => (
    <div className="mb-4">
        <label className="block text-left mb-2" htmlFor={id}>
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
            aria-describedby={`${id}-error`}
        />
        {error && <p id={`${id}-error`} className="text-red-500 text-left" role="alert">{error}</p>}
    </div>
);

const RegisterPage: React.FC = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormState({ ...formState, [id]: value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(formState);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/register`,
                {
                    name: formState.name,
                    email: formState.email,
                    password: formState.password,
                    password_confirmation: formState.passwordConfirmation,
                },
                {
                    withCredentials: true, // Ensure credentials like cookies are included in requests
                }
            );

            localStorage.setItem('auth_token', response.data.token);
            navigate('/contact-books');
        } catch (error: any) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Sign up</h1>
            <form onSubmit={handleRegister} className="max-w-md mx-auto">
                <FormField
                    id="name"
                    label="Name"
                    value={formState.name}
                    onChange={handleChange}
                    error={errors.name}
                />
                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                <FormField
                    id="passwordConfirmation"
                    label="Confirm Password"
                    type="password"
                    value={formState.passwordConfirmation}
                    onChange={handleChange}
                    error={errors.passwordConfirmation}
                />
                {errors.general && <p className="text-red-500 text-center mb-4" role="alert">{errors.general}</p>}

                <button
                    type="submit"
                    className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
