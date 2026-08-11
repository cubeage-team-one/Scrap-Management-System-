import * as authService from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration successful. Waiting for admin approval.",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};