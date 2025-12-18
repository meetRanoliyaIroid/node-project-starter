const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    // skipSuccessfulRequests: true,
    handler: (req, res) => {
        return res.status(429).json({
            status: false,
            message: 'Too many requests, please try again later.',
        });
    },
    keyGenerator: (req, res) => ipKeyGenerator(req.ip),
});

module.exports = limiter;