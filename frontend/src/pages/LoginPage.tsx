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

    return {
        formState,
        errors,
        loading,
        setErrors,
        setLoading,
        handleChange,
    };
};

const loginUser = async (formState: any) => {
    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        {
            email: formState.email,
            password: formState.password,
        },
        {
            withCredentials: true,
        }
    );
    return response.data.token;
};

const LoginPage: React.FC = () => {
    const {
        formState,
        errors,
        loading,
        setErrors,
        setLoading,
        handleChange,
    } = useFormState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        setLoading(true);
        try {
            const token = await loginUser(formState);
            localStorage.setItem('auth_token', token);
            navigate('/contact-books');
        } catch (error: any) {
            if (error.response?.data?.errors) {
                // If there are specific errors returned from the API
                setErrors(error.response.data.errors);
            } else if (error.message) {
                // For network errors or CORS errors
                setErrors({ general: error.message });
            } else {
                // Fallback general error
                setErrors({ general: 'Something went wrong. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin} className="max-w-md mx-auto">
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
                {errors.general && <p className="text-red-500 text-center mb-4" role="alert">{errors.general}</p>}

                <button
                    type="submit"
                    className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
