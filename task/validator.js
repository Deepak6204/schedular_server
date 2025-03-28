import { body, query, param, validationResult } from 'express-validator';

// Validator for getting tasks (GET /api/tasks)
const getTasks = [
    query('status').optional().isIn(['pending', 'completed', 'all']),
    query('startDate').optional().isDate({ format: 'YYYY-MM-DD' }),
    query('endDate').optional().isDate({ format: 'YYYY-MM-DD' }),
    query('category').optional().isString(),
    query('isStaticSchedule').optional().isBoolean(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validator for creating a new task (POST /api/tasks)
const createTask = [
    body('title').isString().notEmpty(),
    body('date').isDate({ format: 'YYYY-MM-DD' }),
    body('startTime').isString().matches(/^\d{2}:\d{2}$/),
    body('endTime').isString().matches(/^\d{2}:\d{2}$/),
    body('category').isString().notEmpty(),
    body('isStaticSchedule').isBoolean(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validator for updating a task (PUT /api/tasks/:taskId)
const updateTask = [
    param('taskId').isUUID(),
    body('title').optional().isString(),
    body('date').optional().isDate({ format: 'YYYY-MM-DD' }),
    body('startTime').optional().isString().matches(/^\d{2}:\d{2}$/),
    body('endTime').optional().isString().matches(/^\d{2}:\d{2}$/),
    body('location').optional().isString(),
    body('category').optional().isString(),
    body('isStaticSchedule').optional().isBoolean(),
    body('status').optional().isIn(['pending', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validator for deleting a task (DELETE /api/tasks/:taskId)
const deleteTask = [
    param('taskId').isUUID().withMessage('Invalid task ID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default { getTasks, createTask, updateTask, deleteTask };
