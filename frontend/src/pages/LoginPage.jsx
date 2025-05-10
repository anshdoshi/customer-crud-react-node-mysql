import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  // Initialize Formik
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await api.post("/auth/login", values);
        setToken(res.data.token);
        toast.success("Login successful!");
        navigate("/"); // Navigate to home page after login
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
      }
      setSubmitting(false);
    },
  });

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="col-md-4">
        <h2 className="text-center mb-4">Login</h2>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Email input */}
          <input
            className="form-control mb-2"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Email error message */}
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger mb-2">{formik.errors.email}</div>
          )}

          {/* Password input */}
          <input
            className="form-control mb-2"
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Password error message */}
          {formik.touched.password && formik.errors.password && (
            <div className="text-danger mb-2">{formik.errors.password}</div>
          )}

          {/* Submit button */}
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register link */}
        <div className="text-center mt-3">
          <Link to="/register">Don’t have an account? Register</Link>
        </div>
      </div>
    </div>
  );
}
