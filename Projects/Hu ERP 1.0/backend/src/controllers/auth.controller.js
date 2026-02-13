import { asyncHandler } from '../middlewares/errorHandler.js';
import authService from '../services/auth.service.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/User.js';
import encryptionUtil from '../utils/encryption.js';

class AuthController {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  });

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided',
      });
    }

    const result = await authService.refreshToken(refreshToken);

    // Update refresh token cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.tokens.accessToken,
      },
    });
  });

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    await authService.logout(req.user.id, req.token, refreshToken);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  });

  /**
   * Forgot password
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    res.json({
      success: true,
      message: result.message,
    });
  });

  /**
   * Reset password
   * POST /api/v1/auth/reset-password
   */
  resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);

    res.json({
      success: true,
      message: result.message,
    });
  });

  /**
   * Verify email
   * POST /api/v1/auth/verify-email
   */
  verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);

    res.json({
      success: true,
      message: result.message,
    });
  });

  /**
   * Get current user
   * GET /api/v1/auth/me
   */
  getCurrentUser = asyncHandler(async (req, res) => {
    const result = await authService.getCurrentUser(req.user.id);

    res.json({
      success: true,
      data: result,
    });
  });

  /**
   * Send Login OTP
   * POST /api/v1/auth/send-otp
   */
  sendLoginOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to user (hashed)
    user.loginOtp = encryptionUtil.hashData(otp);
    user.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send email
    const message = `Your login OTP is: ${otp}. It is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Haridwar University ERP - Login OTP',
        message
      });

      res.status(200).json({
        success: true,
        message: 'OTP sent to email successfully'
      });
    } catch (error) {
      console.error('Email send failed:', error.message);
      
      // FALLBACK for development/broken SMTP:
      // Don't clear OTP, allow user to login if they have access to server logs
      console.log('##################################################');
      console.log(`# LOGIN OTP for ${user.email}: ${otp}`);
      console.log('##################################################');

      // Return success anyway so frontend proceeds to OTP entry screen
      return res.status(200).json({
        success: true,
        message: 'OTP generated (Email failed, check server logs)'
      });
    }
  });

  /**
   * Login with OTP
   * POST /api/v1/auth/login-with-otp
   */
  loginWithOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    const user = await User.findOne({ email }).select('+loginOtp +loginOtpExpires');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or OTP'
      });
    }

    if (!user.loginOtp || !user.loginOtpExpires) { 
        return res.status(400).json({
            success: false,
            message: 'OTP not expired or invalid'
        });
    }

    // Verify OTP
    const isOtpValid = encryptionUtil.compareData(otp, user.loginOtp);
    const isExpired = Date.now() > user.loginOtpExpires;

    if (!isOtpValid || isExpired) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Create tokens
    const tokens = await authService.generateTokens(user);

    // Clear OTP
    user.loginOtp = undefined;
    user.loginOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Set refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  });
}

export default new AuthController();
