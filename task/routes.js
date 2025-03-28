import express from 'express';
import TaskController from './controller.js';
import taskValidator from './validator.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management operations
 */

/**
 * @swagger
 * path:
 *  /api/tasks:
 *    get:
 *      summary: Retrieve a list of tasks
 *      tags: [Tasks]
 *      parameters:
 *        - name: status
 *          in: query
 *          description: Filter tasks by status (pending, completed, all)
 *          required: false
 *          schema:
 *            type: string
 *            enum: [pending, completed, all]
 *        - name: startDate
 *          in: query
 *          description: Filter tasks by start date
 *          required: false
 *          schema:
 *            type: string
 *            format: date
 *        - name: endDate
 *          in: query
 *          description: Filter tasks by end date
 *          required: false
 *          schema:
 *            type: string
 *            format: date
 *        - name: category
 *          in: query
 *          description: Filter tasks by category
 *          required: false
 *          schema:
 *            type: string
 *        - name: isStaticSchedule
 *          in: query
 *          description: Filter tasks by static schedule
 *          required: false
 *          schema:
 *            type: boolean
 *      responses:
 *        200:
 *          description: A list of tasks
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    title:
 *                      type: string
 *                    date:
 *                      type: string
 *                    startTime:
 *                      type: string
 *                    endTime:
 *                      type: string
 *                    location:
 *                      type: string
 *                    category:
 *                      type: string
 *                    status:
 *                      type: string
 *                    priority:
 *                      type: string
 *                    duration:
 *                      type: number
 */

/**
 * @swagger
 * path:
 *  /api/tasks:
 *    post:
 *      summary: Create a new task
 *      tags: [Tasks]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Title of the task
 *                date:
 *                  type: string
 *                  format: date
 *                startTime:
 *                  type: string
 *                  description: Start time of the task (HH:MM)
 *                endTime:
 *                  type: string
 *                  description: End time of the task (HH:MM)
 *                location:
 *                  type: string
 *                category:
 *                  type: string
 *                isStaticSchedule:
 *                  type: boolean
 *      responses:
 *        201:
 *          description: Task created successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *                  date:
 *                    type: string
 *                  startTime:
 *                    type: string
 *                  endTime:
 *                    type: string
 *                  location:
 *                    type: string
 *                  category:
 *                    type: string
 *                  isStaticSchedule:
 *                    type: boolean
 */

/**
 * @swagger
 * path:
 *  /api/tasks/{taskId}:
 *    put:
 *      summary: Update a task
 *      tags: [Tasks]
 *      parameters:
 *        - name: taskId
 *          in: path
 *          required: true
 *          description: The ID of the task to update
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                date:
 *                  type: string
 *                  format: date
 *                startTime:
 *                  type: string
 *                endTime:
 *                  type: string
 *                location:
 *                  type: string
 *                category:
 *                  type: string
 *                isStaticSchedule:
 *                  type: boolean
 *                status:
 *                  type: string
 *                  enum: [pending, completed]
 *                priority:
 *                  type: string
 *                  enum: [low, medium, high]
 *      responses:
 *        200:
 *          description: Task updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *                  date:
 *                    type: string
 *                  startTime:
 *                    type: string
 *                  endTime:
 *                    type: string
 *                  location:
 *                    type: string
 *                  category:
 *                    type: string
 *                  status:
 *                    type: string
 *                  priority:
 *                    type: string
 *                    enum: [low, medium, high]
 */

/**
 * @swagger
 * path:
 *  /api/tasks/{taskId}:
 *    delete:
 *      summary: Delete a task
 *      tags: [Tasks]
 *      parameters:
 *        - name: taskId
 *          in: path
 *          required: true
 *          description: The ID of the task to delete
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Task deleted successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *        404:
 *          description: Task not found
 */

router.get('/api/tasks', taskValidator.getTasks, TaskController.getTasks);
router.post('/api/tasks', taskValidator.createTask, TaskController.createTask);
router.put('/api/tasks/:taskId', taskValidator.updateTask, TaskController.updateTask);
router.delete('/api/tasks/:taskId', taskValidator.deleteTask, TaskController.deleteTask);

export default router;
