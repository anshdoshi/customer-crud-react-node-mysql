import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

export default function EditCustomerModal({ show, customer, onClose }) {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // Mutation for updating customer details
  const updateMutation = useMutation(
    (values) =>
      api.put(`/customers/${customer.id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: () => {
        // Invalidate customer list to refresh data
        queryClient.invalidateQueries("customers");
        toast.success("Customer updated successfully!");
        onClose(); // Close the modal on success
      },
      onError: () => {
        toast.error("Failed to update customer.");
      },
    }
  );

  // Initialize Formik form
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phone: Yup.string().required("Phone is required"),
      address: Yup.string(), // Address is optional
    }),
    onSubmit: (values) => {
      updateMutation.mutate(values);
    },
    enableReinitialize: true, // Reinitialize form when customer prop changes
  });

  // Populate form fields when customer prop changes
  useEffect(() => {
    if (customer) {
      formik.setValues({
        name: customer.name || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    }
  }, [customer]);

  // Do not render modal if show is false
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={formik.handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Edit Customer</h5>
            {/* <button className="close" onClick={onClose} type="button">
              <span>&times;</span>
            </button> */}
          </div>

          <div className="modal-body">
            {/* Name input field */}
            <input
              className="form-control mb-2"
              name="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.errors.name && formik.touched.name && (
              <div className="text-danger mb-2">{formik.errors.name}</div>
            )}

            {/* Phone input field */}
            <input
              className="form-control mb-2"
              name="phone"
              placeholder="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            {formik.errors.phone && formik.touched.phone && (
              <div className="text-danger mb-2">{formik.errors.phone}</div>
            )}

            {/* Address input field */}
            <input
              className="form-control mb-2"
              name="address"
              placeholder="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
            />
            {formik.errors.address && formik.touched.address && (
              <div className="text-danger mb-2">{formik.errors.address}</div>
            )}
          </div>

          <div className="modal-footer">
            {/* Cancel button */}
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            {/* Submit (Save) button */}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
