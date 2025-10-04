jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BuyerSignup from "../app/signup/buyer/page";

describe("BuyerSignup Form", () => {
  test("shows error when name is empty", () => {
    render(<BuyerSignup />);
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "" } });
    fireEvent.click(screen.getByText(/submit/i));
    expect(screen.getByText(/name cannot be empty/i)).toBeInTheDocument();
  });

  test("shows error when email is invalid", () => {
    render(<BuyerSignup />);
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Test User" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "invalid" } });
    fireEvent.click(screen.getByText(/submit/i));
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  test("shows password requirements", () => {
    render(<BuyerSignup />);
    expect(screen.getByText(/at least 8 characters long/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one uppercase letter/i)).toBeInTheDocument();
  });

  // Add more tests for password validation, success message, etc.
});
