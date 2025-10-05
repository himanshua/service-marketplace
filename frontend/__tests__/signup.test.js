import React from "react";
import { render, screen, within } from "@testing-library/react";
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
    const roleSelect = screen.getByLabelText(/role/i);
    expect(roleSelect).toBeInTheDocument();
    const options = within(roleSelect).getAllByRole("option");
    const optionTexts = options.map((o) => o.textContent);
    expect(optionTexts).toEqual(expect.arrayContaining(["User", "Provider", "Admin"]));
  });
});
