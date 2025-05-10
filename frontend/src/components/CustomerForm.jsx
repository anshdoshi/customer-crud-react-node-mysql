import React from "react";
import { useMutation, useQueryClient } from "react-query";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function CustomerForm() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // Mutation for creating a customer
  const mutation = useMutation(
    (values) =>
      api.post("/customers", values, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: () => {
        // Refetch customer list after adding a new customer
        queryClient.invalidateQueries("customers");
      },
    }
  );

  // Initial form values
  const initialValues = { name: "", address: "", phone: "" };

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
  });

  // Handle form submit
  const handleSubmit = (values, { resetForm }) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Customer Added Successfully!");
        resetForm(); // Clear form fields after success
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {/* Formik render props */}
      {({ isSubmitting }) => (
        <Form className="mb-4">
          <div className="form-row">
            {/* Name Field */}
            <div className="col mr-2 mb-2">
              <Field name="name" className="form-control" placeholder="Name" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger small"
              />
            </div>

            {/* Address Field */}
            <div className="col mr-2 mb-2">
              <Field
                name="address"
                className="form-control"
                placeholder="Address"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-danger small"
              />
            </div>

            {/* Phone Field */}
            <div className="col mb-2">
              <Field
                name="phone"
                className="form-control"
                placeholder="Phone"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-danger small"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-success btn-block"
            disabled={isSubmitting || mutation.isLoading}
          >
            {mutation.isLoading ? "Adding..." : "Add Customer"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
