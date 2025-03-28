import TaskModel from './model.js';

// TaskController class
class TaskController {
    // Get tasks
    static async getTasks(req, res) {
        try {
            const filters = req.query;
            const tasks = await TaskModel.getTasks(filters);
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Create a new task
    static async createTask(req, res) {
        try {
            const taskData = req.body;
            const newTask = await TaskModel.createTask(taskData);
            res.status(201).json(newTask);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    // Update an existing task
    static async updateTask(req, res) {
        try {
            const { taskId } = req.params;
            const updates = req.body;
            const updatedTask = await TaskModel.updateTask(taskId, updates);
            res.json(updatedTask);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    // Delete a task
    static async deleteTask(req, res) {
        try {
            const { taskId } = req.params;
            const success = await TaskModel.deleteTask(taskId);
            if (success) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: 'Task not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
}

export default TaskController;
