import express from 'express';
import TaskController from './controller.js';
import TaskValidator from './validator.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve a list of tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, all]
 *         description: Filter tasks by status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks starting from this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks ending before this date (YYYY-MM-DD)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter tasks by category
 *       - in: query
 *         name: isStaticSchedule
 *         schema:
 *           type: boolean
 *         description: Filter tasks by static schedule flag
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */
router.get('/', TaskValidator.getTasks, TaskController.getTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/', TaskValidator.createTask, TaskController.createTask);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdate'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input data or task not found
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.put('/:taskId', TaskValidator.updateTask, TaskController.updateTask);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid task ID
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete('/:taskId', TaskValidator.deleteTask, TaskController.deleteTask);

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated UUID for the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the task (YYYY-MM-DD)
 *         startTime:
 *           type: string
 *           format: time
 *           pattern: '^\d{2}:\d{2}$'
 *           description: The start time of the task (HH:MM)
 *         endTime:
 *           type: string
 *           format: time
 *           pattern: '^\d{2}:\d{2}$'
 *           description: The end time of the task (HH:MM)
 *         location:
 *           type: string
 *           description: The location of the task
 *         category:
 *           type: string
 *           description: The category of the task
 *         isStaticSchedule:
 *           type: boolean
 *           description: Whether the task is part of a static schedule
 *         status:
 *           type: string
 *           enum: [pending, completed]
 *           default: pending
 *           description: The status of the task
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           default: medium
 *           description: The priority of the task
 *         duration:
 *           type: integer
 *           description: The duration of the task in minutes
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         title: "Team Meeting"
 *         date: "2023-05-15"
 *         startTime: "09:00"
 *         endTime: "10:00"
 *         location: "Conference Room A"
 *         category: "Meeting"
 *         isStaticSchedule: false
 *         status: "pending"
 *         priority: "medium"
 *         duration: 60
 * 
 *     TaskInput:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - startTime
 *         - endTime
 *         - category
 *         - isStaticSchedule
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the task (YYYY-MM-DD)
 *         startTime:
 *           type: string
 *           format: time
 *           pattern: '^\d{2}:\d{2}$'
 *           description: The start time of the task (HH:MM)
 *         endTime:
 *           type: string
 *           format: time
 *           pattern: '^\d{2}:\d{2}$'
 *           description: The end time of the task (HH:MM)
 *         location:
 *           type: string
 *           description: The location of the task
 *         category:
 *           type: string
 *           description: The category of the task
 *         isStaticSchedule:
 *           type: boolean
 *           description: Whether the task is part of a static schedule
 *       example:
 *         title: "Team Meeting"
 *         date: "2023-05-15"
 *         startTime: "09:00"
 *         endTime: "10:00"
 *         location: "Conference Room A"
 *         category: "Meeting"
 *         isStaticSchedule: false
 * 
 *     TaskUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the task (YYYY-MM-DD)
 *         startTime:
 *           type: string
 *           format: time
 *           pattern: '^\d{2}:\d{2}$'
 *           description: The start time of the task (HH:MM)
 *         endTime:
 *           type: string
 *           format: time
 *           pattern: '^\d{2}:\d{2}$'
 *           description: The end time of the task (HH:MM)
 *         location:
 *           type: string
 *           description: The location of the task
 *         category:
 *           type: string
 *           description: The category of the task
 *         isStaticSchedule:
 *           type: boolean
 *           description: Whether the task is part of a static schedule
 *         status:
 *           type: string
 *           enum: [pending, completed]
 *           description: The status of the task
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: The priority of the task
 *       example:
 *         title: "Updated Team Meeting"
 *         date: "2023-05-15"
 *         startTime: "10:00"
 *         endTime: "11:00"
 *         location: "Conference Room B"
 *         category: "Important Meeting"
 *         isStaticSchedule: true
 *         status: "pending"
 *         priority: "high"
 */

export default router;