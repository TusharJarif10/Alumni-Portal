"use client"
import { useState } from "react";
import Link from "next/link";
import axios from "axios";


// Sample dataset of valid registration numbers (replace with your actual data)
const validRegistrationNos = [
"2011581072",
"2011581074",
"2011581075",
"2011581077",
"2011581080",
"2011581082",
"2011581083",
"2011581085",
"2011581087",
"2011581088",
"2011581089",
"2011581091",
"2011581092",
"2011581093",
"2011581094",
"2011581095",
"2011581151",
"2011581154",
"2011581160",
"2011640653",
"2011574895",
"2011581027",
"2011581028",
"2011581029",
"2011581030",
"2011581031",
"2011581032",
"2011581033",
"2011581034",
"2011581035",
"2011581036",
"2011581037",
"2011581038",
"2011581039",
"2011581040",
"2011581041",
"2011581042",
"2011581043",
"2011581045",
"2011581047",
"2011581049",
"2011581050",
"2011581053",
"2011581054",
"2011581056",
"2011581057",
"2011581057",
"2011581057",
"2011581060",
"2011581062",
"2011581065",
"2011581066",
"2011581067",
"2011581069",
"2011581099",
"2011581100",
"2011581102",
"2011581104",
"2011581105",
"2011581109",
"2011581112",
"2011581116",
"2011581117",
"2011581119",
"2011581121",
"2011581122",
"2011581130",
"2011581131"
];



export default function Register() {
  const [name, setName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [regerror, setRegerror] = useState("");

  // Email validation function
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleRegister = async () => {
    if (!name || !registrationNo || !dateOfBirth || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

     // Check if the registration number exists in the valid dataset
     if (!validRegistrationNos.includes(registrationNo)) {
      setRegerror("Invalid registration number.");
      return;
    }

    setError("");
    setLoader(true);

    try {
      let res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, registrationNo, dateOfBirth, email, password }),
      });

      let json = await res.json();

      setLoader(false);

      if (json.success && json.url) {
        window.location.href = json.url;
      } else {
        alert("Payment initiation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("An error occurred. Please try again.");
      setLoader(false);
    }
  };

  return (
    <div className="bg-base-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-gradient-to-r from-base-200 to-secondary border-base-300 text-white/70">
        <h1 className="text-3xl font-bold text-center ">Register for Alumni Portal</h1>

        <div>
          <label htmlFor="name" className="block text-sm font-medium ">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border "
            required
          />
        </div>

        <div>
          <label htmlFor="registrationNo" className="block text-sm font-medium ">Registration Number</label>
          <input
            type="text"
            id="registrationNo"
            placeholder="Enter your registration number"
            value={registrationNo}
            onChange={(e) => setRegistrationNo(e.target.value)}
            className="w-full px-4 py-2 mt-2  rounded-lg border "
            required
          />
          {regerror && <p className="text-red-500 text-sm mt-1">{regerror}</p>}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium ">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium ">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-4 py-2 mt-2 rounded-lg border"
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium ">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border"
            required
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full py-2 mt-4 btn font-semibold rounded-lg shadow-lg bg-neutral/60 text-warning-content hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loader}
        >
          {loader ? "Processing..." : "Register"}
        </button>

        <p className="text-center text-sm ">
          Already have an account?{' '}
          <Link href="/login">
            <button className="text-warning font-semibold hover:underline">Login here</button>
          </Link>
        </p>
      </div>
    </div>
  );
}
