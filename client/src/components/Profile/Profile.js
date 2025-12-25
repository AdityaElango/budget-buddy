import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../Context/Context";
import { API_BASE_URL } from "../../api/api";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { logindata, setLoginData } = useContext(LoginContext);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const validateUser = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const res = await fetch(`${API_BASE_URL}/validuser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          credentials: "include",
        });

        const data = await res.json();

        if (data.status === 401 || !data.ValidUserOne) {
          navigate("/login");
        } else {
          setLoginData(data);
          setFormData({
            fname: data.ValidUserOne.fname || "",
            lname: data.ValidUserOne.lname || "",
            email: data.ValidUserOne.email || "",
            phone: data.ValidUserOne.phone || "",
          });
        }
      } catch (error) {
        console.error("Error validating user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, [navigate, setLoginData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fname.trim()) {
      newErrors.fname = "First name is required";
    }
    if (!formData.lname.trim()) {
      newErrors.lname = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("usersdatatoken");

      const response = await fetch(`${API_BASE_URL}/updateuser/${logindata.ValidUserOne._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        credentials: "include",
        body: JSON.stringify({
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginData({
          ...logindata,
          ValidUserOne: {
            ...logindata.ValidUserOne,
            fname: formData.fname,
            lname: formData.lname,
            email: formData.email,
            phone: formData.phone,
          },
        });
        setEditMode(false);
      } else {
        setErrors({ submit: data.message || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: "An error occurred while updating profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (logindata?.ValidUserOne) {
      setFormData({
        fname: logindata.ValidUserOne.fname || "",
        lname: logindata.ValidUserOne.lname || "",
        email: logindata.ValidUserOne.email || "",
        phone: logindata.ValidUserOne.phone || "",
      });
    }
    setEditMode(false);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading...</div>
      </div>
    );
  }

  const user = logindata?.ValidUserOne;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.fname?.[0]?.toUpperCase()}{user?.lname?.[0]?.toUpperCase()}
            </div>
          </div>
          <div className="profile-title">
            <h1>My Profile</h1>
            <p>Manage your account information</p>
          </div>
        </div>

        {errors.submit && (
          <div className="error-message">
            <p>{errors.submit}</p>
          </div>
        )}

        <div className="profile-content">
          {editMode ? (
            <form className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fname">First Name *</label>
                  <input
                    type="text"
                    id="fname"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    className={errors.fname ? "error" : ""}
                    disabled={loading}
                  />
                  {errors.fname && <span className="error-text">{errors.fname}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lname">Last Name *</label>
                  <input
                    type="text"
                    id="lname"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    className={errors.lname ? "error" : ""}
                    disabled={loading}
                  />
                  {errors.lname && <span className="error-text">{errors.lname}</span>}
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  disabled={loading}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="phone">Phone (10 digits)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  className={errors.phone ? "error" : ""}
                  disabled={loading}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-view">
              <div className="profile-field">
                <label>First Name</label>
                <p>{user?.fname || "Not provided"}</p>
              </div>

              <div className="profile-field">
                <label>Last Name</label>
                <p>{user?.lname || "Not provided"}</p>
              </div>

              <div className="profile-field">
                <label>Email Address</label>
                <p>{user?.email || "Not provided"}</p>
              </div>

              <div className="profile-field">
                <label>Phone Number</label>
                <p>{user?.phone || "Not provided"}</p>
              </div>

              <div className="profile-field">
                <label>Member Since</label>
                <p>{new Date(user?.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
