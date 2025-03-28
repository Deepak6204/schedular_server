import TaskModel from './model.js';

class TaskController {
    static async getTasks(req, res) {
        try {
            const filters = req.query;
            const tasks = await TaskModel.getTasks(filters);
            res.json({
                success: true,
                data: tasks,
                message: 'Tasks retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getTasks:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    static async createTask(req, res) {
        try {
            const taskData = req.body;
            const newTask = await TaskModel.createTask(taskData);
            res.status(201).json({
                success: true,
                data: newTask,
                message: 'Task created successfully'
            });
        } catch (error) {
            console.error('Error in createTask:', error);
            res.status(400).json({
                success: false,
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    static async updateTask(req, res) {
        try {
            const { taskId } = req.params;
            const updates = req.body;
            const updatedTask = await TaskModel.updateTask(taskId, updates);
            
            res.json({
                success: true,
                data: updatedTask,
                message: 'Task updated successfully'
            });
        } catch (error) {
            console.error('Error in updateTask:', error);
            const statusCode = error.message.includes('not found') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    static async deleteTask(req, res) {
        try {
            const { taskId } = req.params;
            const success = await TaskModel.deleteTask(taskId);
            
            if (success) {
                res.json({
                    success: true,
                    message: 'Task deleted successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Task not found'
                });
            }
        } catch (error) {
            console.error('Error in deleteTask:', error);
            res.status(400).json({
                success: false,
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
}

export default TaskController;