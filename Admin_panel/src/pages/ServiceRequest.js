import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import "./ServiceRequest.css";

const ServiceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    guestName: "",
    roomNumber: "",
    requestType: "Housekeeping",
    description: "",
    priority: "Medium"
  });

  const requestTypes = [
    "Housekeeping",
    "Room Service",
    "Maintenance",
    "Laundry",
    "Technical Support",
    "Extra Bed",
    "Wake-up Call",
    "Other"
  ];

  const priorities = ["High", "Medium", "Low"];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requestsCollection = collection(db, "serviceRequests");
      const snapshot = await getDocs(requestsCollection);
      const requestsList = [];
      snapshot.forEach((doc) => {
        requestsList.push({ id: doc.id, ...doc.data() });
      });
      setRequests(requestsList);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load service requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequest = async () => {
    if (!newRequest.guestName || !newRequest.roomNumber) {
      setError("Please fill in guest name and room number");
      return;
    }

    try {
      await addDoc(collection(db, "serviceRequests"), {
        ...newRequest,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewRequest({
        guestName: "",
        roomNumber: "",
        requestType: "Housekeeping",
        description: "",
        priority: "Medium"
      });
      fetchRequests();
    } catch (err) {
      console.error("Error adding request:", err);
      setError("Failed to add service request");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const requestRef = doc(db, "serviceRequests", id);
      await updateDoc(requestRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update request status");
    }
  };

  const handleDeleteRequest = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await deleteDoc(doc(db, "serviceRequests", id));
        fetchRequests();
      } catch (err) {
        console.error("Error deleting request:", err);
        setError("Failed to delete request");
      }
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      High: { color: "#dc2626", bg: "#fee2e2" },
      Medium: { color: "#f59e0b", bg: "#fef3c7" },
      Low: { color: "#10b981", bg: "#d1fae5" }
    };
    const p = priorityColors[priority] || priorityColors.Medium;
    return <span className="priority-badge" style={{ background: p.bg, color: p.color }}>{priority}</span>;
  };

  // The rest of your component remains the same...

};

export default ServiceRequest;