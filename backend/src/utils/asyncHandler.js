/**
 * Async Handler Utility
 * Wraps async route handlers to automatically catch errors and pass them to Express error handler
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Before:
 * export const getUsers = async (req, res) => {
 *   try {
 *     const users = await User.find();
 *     res.json(users);
 *   } catch (error) {
 *     res.status(500).json({ message: error.message });
 *   }
 * };
 * 
 * // After:
 * export const getUsers = asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * });
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

