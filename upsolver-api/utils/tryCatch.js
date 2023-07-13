import errorHandler from "../middleware/errorHandler.js";

export default function tryCatch(functionToTry) {
  return async (req, res, next) => {
    try {
      await functionToTry(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
