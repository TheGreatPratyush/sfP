// Runs a validation function before the controller

const validateRequest = (validator) => {
    return (req, res, next) => {
        try {
            validator(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

module.exports = validateRequest;