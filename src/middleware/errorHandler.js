export default (err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
      return res.status(422).json({
        success: false,
        message: err.error.details[0].message,
      });
    }
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };