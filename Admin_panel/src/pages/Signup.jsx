import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Signup.css";

/* Icons */
const Icon = ({ children }) => (
  <span className="input-icon">{children}</span>
);

const Eye = ({ show }) => (
  <span className="eye-icon">{show ? "👁️" : "🙈"}</span>
);

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    nic: "",
    gender: "",
    dob: "",
    address: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.role) return setError("Select a role");
    if (!form.phone.match(/^07[0-9]{8}$/))
      return setError("Phone must be 10 digits (07XXXXXXXX)");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await setDoc(doc(db, "users", user.uid), {
        ...form,
        createdAt: new Date()
      });

      navigate("/");
    } catch {
      setError("Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <h2>Create Account</h2>

        {error && <div className="signup-error">{error}</div>}

        <form onSubmit={handleSignup}>

          {/* Name */}
          <div className="input-wrap">
            <Icon>👤</Icon>
            <input name="fullName" placeholder="Full Name" onChange={handleChange} />
          </div>

          {/* Email */}
          <div className="input-wrap">
            <Icon>📧</Icon>
            <input name="email" placeholder="Email" onChange={handleChange} />
          </div>

          {/* NIC */}
          <div className="input-wrap">
            <Icon>🆔</Icon>
            <input name="nic" placeholder="NIC / ID Number" onChange={handleChange} />
          </div>

          {/* Phone */}
          <div className="input-wrap">
            <Icon>📱</Icon>
            <input name="phone" placeholder="0712345678" onChange={handleChange} />
          </div>

          {/* Gender */}
          <select name="gender" className="signup-input" onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          {/* DOB */}
          <div className="input-wrap">
            <Icon>📅</Icon>
            <input type="date" name="dob" onChange={handleChange} />
          </div>

          {/* Address */}
          <div className="input-wrap">
            <Icon>📍</Icon>
            <input name="address" placeholder="Address" onChange={handleChange} />
          </div>

          {/* Role */}
          <select name="role" className="signup-input" onChange={handleChange}>
            <option value="">Select Role</option>
            <option>Hotel Administrator</option>
                  <option>Front Desk Manager</option>
                  <option>Housekeeping Supervisor</option>
                  <option>Maintenance Manager</option>
                  <option>Kitchen Manager</option>
          </select>

          {/* Password */}
          <div className="input-wrap">
            <Icon>🔒</Icon>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              <Eye show={showPassword} />
            </span>
          </div>

          {/* Confirm Password */}
          <div className="input-wrap">
            <Icon>🔒</Icon>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              <Eye show={showConfirm} />
            </span>
          </div>

          <button disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Signup;