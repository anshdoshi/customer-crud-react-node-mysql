import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import Spinner from "./Spinner";
import EditCustomerModal from "./EditCustomerModal";
import DeleteCustomerModal from "./DeleteCustomerModal";
import { toast } from "react-toastify";
import { debounce } from "lodash";

export default function CustomerList() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // Local state for modals and search
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch customers with pagination + search using React Query
  const { data, isLoading, isFetching } = useQuery(
    ["customers", currentPage, search],
    async () => {
      const res = await api.get("/customers", {
        params: { page: currentPage, search },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    { keepPreviousData: true }
  );

  // Mutation for deleting a customer
  const deleteMutation = useMutation(
    (id) =>
      api.delete(`/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customers", currentPage, search]);
        toast.success("Customer deleted!");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete customer.");
      },
    }
  );

  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedCustomer) {
      deleteMutation.mutate(selectedCustomer.id);
    }
  };

  // Debounce search input (delay search request by 500ms)
  const debouncedSearch = debounce((value) => {
    setSearch(value);
    setCurrentPage(1); // Reset to page 1 on new search
  }, 500);

  // Update search when input changes
  useEffect(() => {
    debouncedSearch(searchInput);
    return debouncedSearch.cancel;
  }, [searchInput]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Customer List</h2>

      {/* Search Input */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or phone..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
      </div>

      {/* Customer Table */}
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* Show Spinner while loading data */}
        {!isLoading ? (
          <tbody>
            {/* If no data, show message */}
            {data?.customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No data found
                </td>
              </tr>
            ) : (
              // Map and display customer rows
              data?.customers.map((cust) => (
                <tr key={cust.id}>
                  <td>{cust.id}</td>
                  <td>{cust.name}</td>
                  <td>{cust.phone}</td>
                  <td>{cust.address || "-"}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        ) : (
          // Show Spinner inside table when loading
          <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "150px",
                  }}
                >
                  <Spinner />
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>

      {/* Pagination Controls */}
      {!isLoading && (
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-primary"
            disabled={currentPage === 1 || isFetching}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {data?.page} of {data?.lastPage}
          </span>
          <button
            className="btn btn-outline-primary"
            disabled={currentPage === data?.lastPage || isFetching}
            onClick={() =>
              setCurrentPage((prev) =>
                data?.lastPage ? Math.min(prev + 1, data.lastPage) : prev + 1
              )
            }
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      <EditCustomerModal
        show={showEditModal}
        customer={selectedCustomer}
        onClose={() => setShowEditModal(false)}
      />

      {/* Delete Modal */}
      <DeleteCustomerModal
        show={showDeleteModal}
        customer={selectedCustomer}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isLoading}
      />
    </div>
  );
}
