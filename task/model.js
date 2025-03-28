import pool from '../config/database.js';

class TaskModel {
    static async getTasks(filters = {}) {
        const { status, startDate, endDate, category, isStaticSchedule } = filters;
        try {
            let query = 'SELECT * FROM tasks WHERE 1=1';
            const queryParams = [];
            const conditions = [];

            if (status && status !== 'all') {
                conditions.push('status = ?');
                queryParams.push(status);
            }

            if (startDate) {
                conditions.push('date >= ?');
                queryParams.push(startDate);
            }

            if (endDate) {
                conditions.push('date <= ?');
                queryParams.push(endDate);
            }

            if (category) {
                conditions.push('category = ?');
                queryParams.push(category);
            }

            if (isStaticSchedule !== undefined) {
                conditions.push('isStaticSchedule = ?');
                queryParams.push(isStaticSchedule);
            }

            if (conditions.length) {
                query += ' AND ' + conditions.join(' AND ');
            }

            query += ' ORDER BY date, startTime ASC';

            const [rows] = await pool.execute(query, queryParams);
            return rows;
        } catch (error) {
            console.error('Database error in getTasks:', error);
            throw new Error('Failed to retrieve tasks. Please try again later.');
        }
    }

    static async createTask(taskData) {
        const { title, date, startTime, endTime, location, category, isStaticSchedule } = taskData;
        
        if (!title || !date || !startTime || !endTime || !category || isStaticSchedule === undefined) {
            throw new Error('Missing required fields');
        }

        try {
            const query = `
                INSERT INTO tasks 
                (title, date, startTime, endTime, location, category, isStaticSchedule, status, priority, duration)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'medium', ?)
            `;
            
            const duration = this.calculateDuration(startTime, endTime);
            const [result] = await pool.execute(query, [
                title, date, startTime, endTime, location, 
                category, isStaticSchedule, duration
            ]);

            return { 
                id: result.insertId, 
                ...taskData, 
                status: 'pending', 
                priority: 'medium', 
                duration 
            };
        } catch (error) {
            console.error('Database error in createTask:', error);
            throw new Error('Failed to create task. Please check your input and try again.');
        }
    }

    static async updateTask(taskId, updates) {
        if (!taskId) throw new Error('Task ID is required');
        if (!updates || !Object.keys(updates).length) {
            throw new Error('No update data provided');
        }

        try {
            let query = 'UPDATE tasks SET ';
            const queryParams = [];
            const fieldsToUpdate = [];

            const validFields = [
                'title', 'date', 'startTime', 'endTime', 'location', 
                'category', 'isStaticSchedule', 'status', 'priority'
            ];

            for (const [field, value] of Object.entries(updates)) {
                if (validFields.includes(field) && value !== undefined) {
                    fieldsToUpdate.push(`${field} = ?`);
                    queryParams.push(value);
                }
            }

            if (!fieldsToUpdate.length) {
                throw new Error('No valid fields to update');
            }

            query += fieldsToUpdate.join(', ') + ' WHERE id = ?';
            queryParams.push(taskId);

            const [result] = await pool.execute(query, queryParams);
            
            if (result.affectedRows === 0) {
                throw new Error('Task not found');
            }

            // If time fields were updated, recalculate duration
            if (updates.startTime || updates.endTime) {
                await this.updateDuration(taskId);
            }

            return { id: taskId, ...updates };
        } catch (error) {
            console.error('Database error in updateTask:', error);
            throw new Error(error.message.includes('not found') ? 
                'Task not found' : 'Failed to update task. Please try again.');
        }
    }

    static async deleteTask(taskId) {
        if (!taskId) throw new Error('Task ID is required');

        try {
            const query = 'DELETE FROM tasks WHERE id = ?';
            const [result] = await pool.execute(query, [taskId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Database error in deleteTask:', error);
            throw new Error('Failed to delete task. Please try again.');
        }
    }

    static calculateDuration(startTime, endTime) {
        try {
            const start = new Date(`1970-01-01T${startTime}Z`);
            const end = new Date(`1970-01-01T${endTime}Z`);
            return (end - start) / 60000; // Duration in minutes
        } catch (error) {
            console.error('Error calculating duration:', error);
            return 0;
        }
    }

    static async updateDuration(taskId) {
        try {
            const query = `
                UPDATE tasks 
                SET duration = TIMESTAMPDIFF(MINUTE, 
                    CONCAT(date, ' ', startTime), 
                    CONCAT(date, ' ', endTime))
                WHERE id = ?
            `;
            await pool.execute(query, [taskId]);
        } catch (error) {
            console.error('Error updating duration:', error);
        }
    }
}

export default TaskModel;