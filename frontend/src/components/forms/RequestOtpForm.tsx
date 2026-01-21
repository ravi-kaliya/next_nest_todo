// src/components/forms/RequestOtpForm.tsx
"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function RequestOtpForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await apiRequest("/auth/request-otp", "POST", { email });
            setMessage(res.message);
        } catch (err: any) {
            setMessage(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Request OTP
            </button>
            {message && <p>{message}</p>}
        </form>
    );
}
