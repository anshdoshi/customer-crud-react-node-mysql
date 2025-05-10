import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const navigate = useNavigate();

  // Initialize Formik for form state, validation, and submission
  const formik = useFormik({
    initialValues: { email: "", password: "" }, // initial form values
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.post("/auth/register", values);
        toast.success("Registration successful! Please login.");
        navigate("/login"); // redirect to login page on success
      } catch (err) {
        toast.error(err.response?.data?.message || "Registration failed");
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
        <h2 className="text-center mb-4">Register</h2>

        {/* Register form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Email input field */}
          <input
            className="form-control mb-2"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Email validation error */}
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger mb-2">{formik.errors.email}</div>
          )}

          {/* Password input field */}
          <input
            className="form-control mb-2"
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Password validation error */}
          {formik.touched.password && formik.errors.password && (
            <div className="text-danger mb-2">{formik.errors.password}</div>
          )}

          {/* Submit button */}
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Link to login page */}
        <div className="text-center mt-3">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
