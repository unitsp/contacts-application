import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormField from '../components/Forms/FormField';

const useFormState = (initialState: any) => {
    const [formState, setFormState] = useState(initialState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormState({ ...formState, [id]: value });
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formState.name) newErrors.name = 'Name is required';
        if (!formState.email) newErrors.email = 'Email is required';
        if (!formState.password) newErrors.password = 'Password is required';
        if (formState.password !== formState.passwordConfirmation) newErrors.passwordConfirmation = 'Passwords do not match';
        return newErrors;
    };

    return {
        formState,
        errors,
        loading,
        setErrors,
        setLoading,
        handleChange,
        validateForm,
    };
};

const registerUser = async (formState: any) => {
    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        {
            name: formState.name,
            email: formState.email,
            password: formState.password,
            password_confirmation: formState.passwordConfirmation,
        },
        {
            withCredentials: true,
        }
    );
    return response.data.token;
};

const RegisterPage: React.FC = () => {
    const {
        formState,
        errors,
        loading,
        setErrors,
        setLoading,
        handleChange,
        validateForm,
    } = useFormState({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const token = await registerUser(formState);
            localStorage.setItem('auth_token', token);
            navigate('/contact-books');
        } catch (error: any) {
            setErrors(error.response?.data?.errors || { general: 'Something went wrong. Please try again.' });
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
