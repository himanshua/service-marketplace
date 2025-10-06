import React from "react";
import { render, screen } from "@testing-library/react";
import Signup from "../app/signup/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Unified Signup Page", () => {
  test("renders form fields", () => {
    render(<Signup />);

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /signup/i });
    expect(submitBtn).toBeInTheDocument();
  });
});
