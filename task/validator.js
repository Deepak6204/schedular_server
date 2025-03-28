import { body, query, param, validationResult } from 'express-validator';

class TaskValidator {
    static validateRequest(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({
                    param: err.param,
                    message: err.msg,
                    location: err.location
                }))
            });
        }
        next();
    }

    static getTasks = [
        query('status')
            .optional()
            .isIn(['pending', 'completed', 'all'])
            .withMessage('Status must be either pending, completed, or all'),
        query('startDate')
            .optional()
            .isDate({ format: 'YYYY-MM-DD' })
            .withMessage('Start date must be in YYYY-MM-DD format'),
        query('endDate')
            .optional()
            .isDate({ format: 'YYYY-MM-DD' })
            .withMessage('End date must be in YYYY-MM-DD format')
            .custom((value, { req }) => {
                if (req.query.startDate && new Date(value) < new Date(req.query.startDate)) {
                    throw new Error('End date must be after start date');
                }
                return true;
            }),
        query('category')
            .optional()
            .trim()
            .isLength({ min: 1, max: 50 })
            .withMessage('Category must be between 1-50 characters'),
        query('isStaticSchedule')
            .optional()
            .isBoolean()
            .withMessage('isStaticSchedule must be a boolean')
            .toBoolean(),
        TaskValidator.validateRequest
    ];

    static createTask = [
        body('title')
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Title must be between 1-100 characters'),
        body('date')
            .isDate({ format: 'YYYY-MM-DD' })
            .withMessage('Date must be in YYYY-MM-DD format')
            .custom(value => {
                if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
                    throw new Error('Date cannot be in the past');
                }
                return true;
            }),
        body('startTime')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .withMessage('Start time must be in HH:MM format (24-hour)'),
        body('endTime')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .withMessage('End time must be in HH:MM format (24-hour)')
            .custom((value, { req }) => {
                if (value <= req.body.startTime) {
                    throw new Error('End time must be after start time');
                }
                return true;
            }),
        body('location')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Location must be less than 100 characters'),
        body('category')
            .trim()
            .isLength({ min: 1, max: 50 })
            .withMessage('Category must be between 1-50 characters'),
        body('isStaticSchedule')
            .isBoolean()
            .withMessage('isStaticSchedule must be a boolean'),
        TaskValidator.validateRequest
    ];

    static updateTask = [
        param('taskId')
            .isUUID(4)
            .withMessage('Invalid task ID format'),
        body('title')
            .optional()
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Title must be between 1-100 characters'),
        body('date')
            .optional()
            .isDate({ format: 'YYYY-MM-DD' })
            .withMessage('Date must be in YYYY-MM-DD format'),
        body('startTime')
            .optional()
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .withMessage('Start time must be in HH:MM format (24-hour)'),
        body('endTime')
            .optional()
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .withMessage('End time must be in HH:MM format (24-hour)')
            .custom((value, { req }) => {
                if (value && req.body.startTime && value <= req.body.startTime) {
                    throw new Error('End time must be after start time');
                }
                return true;
            }),
        body('location')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Location must be less than 100 characters'),
        body('category')
            .optional()
            .trim()
            .isLength({ min: 1, max: 50 })
            .withMessage('Category must be between 1-50 characters'),
        body('isStaticSchedule')
            .optional()
            .isBoolean()
            .withMessage('isStaticSchedule must be a boolean'),
        body('status')
            .optional()
            .isIn(['pending', 'completed'])
            .withMessage('Status must be either pending or completed'),
        body('priority')
            .optional()
            .isIn(['low', 'medium', 'high'])
            .withMessage('Priority must be either low, medium, or high'),
        TaskValidator.validateRequest
    ];

    static deleteTask = [
        param('taskId')
            .isUUID(4)
            .withMessage('Invalid task ID format'),
        TaskValidator.validateRequest
    ];
}

export default TaskValidator;