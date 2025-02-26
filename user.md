# User Service Documentation

This documentation provides an overview of the user-related processes managed by the UserService class and their corresponding API endpoints. It outlines the available methods, their parameters, expected behaviors, and API routes to help frontend and other developers integrate with these endpoints.

## Table of Contents
- [Authentication Flows](#authentication-flows)
  - [Sign Up](#sign-up)
  - [Sign In](#sign-in)
  - [Refresh Authentication](#refresh-authentication)
- [Verification Processes](#verification-processes)
  - [Email & Phone Verification](#email--phone-verification)
  - [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)
- [User Management](#user-management)
  - [User Profile Operations](#user-profile-operations)
  - [PIN Management](#pin-management)
  - [Password Operations](#password-operations)
- [KYC Management](#kyc-management)
- [Admin Functions](#admin-functions)
- [API Endpoints](#api-endpoints)

## Authentication Flows

### Sign Up
Creates a new user account in the system.

**Method**: `signUp`

**Parameters**:
- `firstName`: User's first name
- `lastName`: User's last name
- `email`: User's email address (must be unique)
- `password`: User's password (will be hashed)
- `phoneNumber`: User's phone number
- `country`: User's country of residence

**Process**:
1. Checks if the email is already registered
2. If email is available, creates a new user account
3. Returns the created user object (without the password field)

**Error Cases**:
- If email is already taken, throws "User already exists" error

**Notes for Frontend**:
- After successful sign-up, users will typically need to verify their email before they can log in

---

### Sign In
Authenticates a user and establishes a session.

**Method**: `signIn`

**Parameters**:
- `email`: User's registered email
- `password`: User's password

**Process**:
1. Locates user by email
2. Verifies email is confirmed
3. Validates password
4. If 2FA is enabled, triggers the appropriate 2FA method
5. Returns user info and 2FA details if applicable

**Error Cases**:
- If email not found, throws "No User found with this email" error
- If email not verified, throws "Email not verified" error
- If password incorrect, throws "Incorrect credentials" error

**Notes for Frontend**:
- If 2FA is enabled, the response will include a `twoFA` object with verification details
- The frontend should collect the 2FA code and verify it before granting access

---

### Refresh Authentication
Generates new authentication tokens using a refresh token.

**Method**: `refreshAuth`

**Parameters**:
- `refreshToken`: Valid refresh token

**Process**:
1. Verifies the refresh token
2. Finds the associated user
3. Removes the used refresh token
4. Generates and returns new auth tokens

**Error Cases**:
- If token invalid or expired, verification will fail

**Notes for Frontend**:
- Use this method to maintain user sessions without requiring re-login
- Store the refresh token securely and use it to obtain new access tokens when they expire

## Verification Processes

### Email & Phone Verification

**Methods**:
- `checkVerificationStatus`: Checks if an email or phone is already verified
- `verifyUser`: Marks an email or phone as verified after successful verification

**Parameters**:
- `type`: Type of verification (email or phone)
- `entity`: The email address or phone number to verify

**Process**:
1. For checking status: Finds user by email/phone and checks verification flag
2. For verification: Updates the verification status for the specified email/phone

**Error Cases**:
- If already verified, throws "[Email/Phone] already verified" error
- If user not found during verification, throws "No User found" error

**Notes for Frontend**:
- Implement a verification flow that collects and validates the OTP sent to the user
- After successful OTP validation, call the verification endpoint

**API Endpoint**:
- `POST /verification` - Initiates code verification process (requires authentication)

---

### Two-Factor Authentication (2FA)

**Methods**:
- `trigger2FA`: Initiates the 2FA process
- `updateTwoFA`: Updates 2FA status for a user

**Parameters**:
- `user`: User document
- `type`: 2FA method type (e.g., email)
- `update`: Whether to update 2FA settings
- `email`: User's email (for updateTwoFA)
- `status`: New 2FA status (for updateTwoFA)

**Process**:
1. For triggering: Marks 2FA as needed and sends verification code if email-based
2. For updating: Updates the 2FA needed status

**Notes for Frontend**:
- When 2FA is triggered during login, collect the verification code from the user
- After successful 2FA verification, proceed with login completion

## User Management

### User Profile Operations

**Methods**:
- `getCurrentUser`: Retrieves current user data
- `getUserProfile`: Gets a user profile by ID
- `updateUserProfile`: Updates user profile data
- `updateUser`: Generic method to update user data

**Parameters**:
- `filter`: Query filters for finding user (for getCurrentUser and updateUser)
- `id`: User ID (for getUserProfile and updateUserProfile)
- `data`: Update data (for updateUserProfile and updateUser)

**Notes for Frontend**:
- Use these methods to display and manage user profile information
- Implement profile editing forms that submit updates to the backend

**API Endpoints**:
- `GET /profile` - Retrieves the current user's profile (requires authentication)
- `PUT /profile` - Updates the current user's profile (requires authentication and validation)

---

### PIN Management

**Methods**:
- `setupPin`: Creates a new PIN for a user
- `verifyPin`: Validates a user's PIN

**Parameters**:
- `id`: User ID (for setupPin)
- `pin`: PIN value
- `user`: User document (for verifyPin)

**Process**:
1. For setup: Hashes the PIN and stores it in the user record
2. For verification: Compares the provided PIN with stored hash

**Error Cases**:
- If PIN verification fails, throws "Your pin is invalid" error

**Notes for Frontend**:
- Implement PIN creation and validation screens
- Use PIN verification before sensitive operations

**API Endpoints**:
- `PATCH /pin` - Sets up a new PIN (requires authentication, username and phone verification)
- `POST /pin` - Verifies a user's PIN (requires authentication)
- `PUT /pin` - Updates a user's PIN (requires authentication and code verification)

---

### Password Operations

**Methods**:
- `resetPassword`: Resets a user's password (typically after forgot password flow)
- `changePassword`: Changes a user's password (requires old password verification)

**Parameters**:
- `email`: User's email
- `password` or `newPassword`: New password to set
- `oldPassword`: Current password (for changePassword)

**Process**:
1. For reset: Directly updates to the new hashed password
2. For change: Verifies old password, then updates to the new hashed password

**Error Cases**:
- For change: If user not found, throws "User not found" error
- For change: If old and new passwords are the same, throws "Password cannot be the same" error
- For change: If old password doesn't match, throws "Password Mismatch" error

**Notes for Frontend**:
- Implement separate flows for password reset and password change
- For reset, typically implement a flow including email verification
- For change, require the user to enter both old and new passwords

## KYC Management

**Method**: `upgradeKYCLevel`

**Parameters**:
- `id`: User ID
- `kyc`: KYC level to upgrade to

**Process**:
1. Retrieves the KYC level details
2. Updates the user's KYC level

**Notes for Frontend**:
- Implement KYC flows that collect necessary documentation based on level
- Update UI to reflect current KYC status and available features

**API Endpoints**:
- `POST /identity-webhook` - Webhook endpoint for identity verification provider (requires webhook validation and user validation)

## Admin Functions

**Method**: `getAllUsers`

**Parameters**:
- `page`: Page number for pagination
- `limit`: Items per page
- `searchTerm`: Optional search term to filter users

**Process**:
1. Calculates pagination parameters
2. If search term provided, creates a regex query for name/email/username fields
3. Returns paginated and filtered user list

**Notes for Frontend**:
- Implement admin panels with user search and pagination controls
- Display user lists with relevant actions
- Consider implementing sorting options

**API Endpoints**:
- `GET /` - Gets all users with pagination (requires validation)
- `GET /all-users` - Admin endpoint for retrieving all users (requires authentication and admin privileges)

## API Endpoints

The following routes are available for user management:

```javascript
// User Routes
router.get('/', RequestValidator.validate(GetAllItemsValidation), userController.getAllUsers);
router.post('/verification', authMiddleware.user, userController.initiateCodeVerification);
router.patch('/pin', [authMiddleware.user, authMiddleware.verifyUsername, authMiddleware.verifyPhone, 
  RequestValidator.validate(SetupPinValidation)], userController.setupNewPin);
router.post('/pin', [authMiddleware.user, RequestValidator.validate(SetupPinValidation)], userController.verifyPin);
router.put('/pin', [authMiddleware.user, authMiddleware.verifyCode, RequestValidator.validate(VerifyCodeValidation),
  RequestValidator.validate(SetupPinValidation)], userController.updatePin);
router.get('/profile', authMiddleware.user, userController.getUserProfile);
router.put('/profile', authMiddleware.user, RequestValidator.validate(UpdateProfileValidation), userController.updateUserProfile);
router.post('/identity-webhook', [webhookMiddleware.validateIdentityPassWebhook, 
  authMiddleware.validateExistingUserIdentity], userController.verifyUserIdentity);
router.get('/all-users', [authMiddleware.user, authMiddleware.validateAdminUser], userController.getAllUsers);
```

### Middleware Details

The API uses several middleware components:

- **AuthMiddleware**: 
  - `user`: Verifies the user is authenticated
  - `verifyUsername`: Ensures username is verified
  - `verifyPhone`: Ensures phone number is verified
  - `verifyCode`: Validates verification codes
  - `validateAdminUser`: Checks if user has admin privileges
  - `validateExistingUserIdentity`: Validates user identity for webhook processing

- **RequestValidator**: Validates request data against predefined schemas
  - `SetupPinValidation`: Validates PIN setup data
  - `UpdateProfileValidation`: Validates profile update data
  - `VerifyCodeValidation`: Validates verification code data
  - `GetAllItemsValidation`: Validates pagination parameters

- **WebhookMiddleware**:
  - `validateIdentityPassWebhook`: Validates webhooks from identity verification provider