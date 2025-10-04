# Buyer Signup Form Documentation

## Features

- Real-time validation for name, email, and password fields
- Password requirements displayed below the input
- Error messages with icons and accessible text
- Success and error messages styled for clarity
- Loading spinner during signup request
- Accessible for keyboard and screen readers
- Responsive design for mobile devices

## Validation Rules

### Name

- Cannot be empty

### Email

- Cannot be empty
- Must be a valid email format (contains @ and .)
- Duplicate emails are not allowed

### Password

- At least 8 characters long
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&\*)
- No spaces

## Accessibility

- Error messages use `aria-live="polite"` for screen readers
- Visually hidden text for error context
- Focus styles for input fields
- Keyboard navigation supported

## Mobile Responsiveness

- Form layout and input sizes adjust for small screens
- Buttons and inputs are easy to tap

## Success/Error Feedback

- Success message shown after signup
- Top error message for network or general errors

## How to Use

1. Fill in all required fields
2. Follow password requirements
3. Submit the form
4. On success, you will be redirected to login

---

For further improvements, test on multiple devices and gather user feedback.
