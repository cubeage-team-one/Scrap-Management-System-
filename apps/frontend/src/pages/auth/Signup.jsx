import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { signup as signupRequest } from "../../core/services/auth.service";
import RoutePath from "../../core/constants/routes.constant";
import { USER_ROLES } from "../../core/constants/app.constant";

const INITIAL_FORM = {
  role: USER_ROLES.INDUSTRY,
  companyName: "",
  gstNumber: "",
  contactName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRole = (role) => {
    setForm({
      ...form,
      role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signupRequest(form);
      navigate(RoutePath.LOGIN);
    } catch {
      setError("Unable to create account.");
    }
  };

  const cardStyle = (role) =>
    `cursor-pointer rounded-xl border p-4 text-center transition-all
     ${
       form.role === role
         ? "border-blue-600 bg-blue-50 shadow-md"
         : "border-gray-300 hover:border-blue-400"
     }`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg grid md:grid-cols-2 overflow-hidden">
        {/* Left Side */}

        <div className="bg-blue-700 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">
            SmartScrap AI
          </h1>

          <p className="text-lg text-blue-100">
            Industrial Scrap Marketplace
          </p>

          <div className="mt-8 space-y-4 text-blue-100">
            <p>✔ Buy Scrap</p>
            <p>✔ Sell Scrap</p>
            <p>✔ Auctions & Quotations</p>
            <p>✔ Verified Businesses</p>
          </div>
        </div>

        {/* Right Side */}

        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Business Type */}

            <div>
              <label className="font-medium">
                Business Type
              </label>

              <div className="grid grid-cols-3 gap-3 mt-2">

                <div
                  onClick={() => handleRole(USER_ROLES.INDUSTRY)}
                  className={cardStyle(USER_ROLES.INDUSTRY)}
                >
                  🏭
                  <p className="mt-2 font-medium">
                    Industry
                  </p>
                </div>

                <div
                  onClick={() => handleRole(USER_ROLES.DEALER)}
                  className={cardStyle(USER_ROLES.DEALER)}
                >
                  ♻️
                  <p className="mt-2 font-medium">
                    Dealer
                  </p>
                </div>

                <div
                  onClick={() => handleRole(USER_ROLES.BUYER)}
                  className={cardStyle(USER_ROLES.BUYER)}
                >
                  🛒
                  <p className="mt-2 font-medium">
                    Buyer
                  </p>
                </div>

              </div>
            </div>

            <input
              name="companyName"
              placeholder="Company Name"
              value={form.companyName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />

            <input
              name="gstNumber"
              placeholder="GST Number"
              value={form.gstNumber}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              name="contactName"
              placeholder="Contact Person Name"
              value={form.contactName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />

            <input
              name="phone"
              placeholder="Mobile Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />

            <textarea
              name="address"
              placeholder="Address"
              rows="3"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <div className="grid grid-cols-3 gap-3">
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3"
              />

              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3"
              />

              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
            >
              Create Account
            </Button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate(RoutePath.LOGIN)}
                className="text-blue-600 font-semibold"
              >
                Login
              </button>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;