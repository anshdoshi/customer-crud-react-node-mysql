import React from "react";

export default function DeleteCustomerModal({
  show,
  customer,
  onCancel,
  onConfirm,
  isLoading,
}) {
  if (!show || !customer) return null;

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            {/* <button className="close" onClick={onCancel}>
              <span>&times;</span>
            </button> */}
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete {customer.name}?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
