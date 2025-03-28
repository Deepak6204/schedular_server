import pool from '../config/database.js';

class TaskModel {

  // Static method to get tasks based on various filters
  static async getTasks(filters) {
    const { status, startDate, endDate, category, isStaticSchedule } = filters;
    try {
      let query = 'SELECT * FROM tasks WHERE 1=1';
      let queryParams = [];

      if (status) {
        query += ' AND status = ?';
        queryParams.push(status);
      }

      if (startDate) {
        query += ' AND date >= ?';
        queryParams.push(startDate);
      }

      if (endDate) {
        query += ' AND date <= ?';
        queryParams.push(endDate);
      }

      if (category) {
        query += ' AND category = ?';
        queryParams.push(category);
      }

      if (isStaticSchedule !== undefined) {
        query += ' AND isStaticSchedule = ?';
        queryParams.push(isStaticSchedule);
      }

      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      throw new Error('Error retrieving tasks: ' + error.message);
    }
  }

  // Static method to create a new task
  static async createTask(taskData) {
    const { title, date, startTime, endTime, location, category, isStaticSchedule } = taskData;
    try {
      const query = `
        INSERT INTO tasks (title, date, startTime, endTime, location, category, isStaticSchedule, status, priority, duration)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'medium', ?)
      `;
      const duration = (new Date(`1970-01-01T${endTime}Z`) - new Date(`1970-01-01T${startTime}Z`)) / 60000; // Duration in minutes
      const [result] = await pool.execute(query, [
        title, date, startTime, endTime, location, category, isStaticSchedule, duration
      ]);
      return { id: result.insertId, ...taskData, status: 'pending', priority: 'medium', duration };
    } catch (error) {
      throw new Error('Error creating task: ' + error.message);
    }
  }

  // Static method to update an existing task
  static async updateTask(taskId, updates) {
    const { title, date, startTime, endTime, location, category, isStaticSchedule, status, priority } = updates;
    try {
      let query = 'UPDATE tasks SET ';
      const queryParams = [];
      const fieldsToUpdate = [];

      if (title) { fieldsToUpdate.push('title = ?'); queryParams.push(title); }
      if (date) { fieldsToUpdate.push('date = ?'); queryParams.push(date); }
      if (startTime) { fieldsToUpdate.push('startTime = ?'); queryParams.push(startTime); }
      if (endTime) { fieldsToUpdate.push('endTime = ?'); queryParams.push(endTime); }
      if (location) { fieldsToUpdate.push('location = ?'); queryParams.push(location); }
      if (category) { fieldsToUpdate.push('category = ?'); queryParams.push(category); }
      if (isStaticSchedule !== undefined) { fieldsToUpdate.push('isStaticSchedule = ?'); queryParams.push(isStaticSchedule); }
      if (status) { fieldsToUpdate.push('status = ?'); queryParams.push(status); }
      if (priority) { fieldsToUpdate.push('priority = ?'); queryParams.push(priority); }

      query += fieldsToUpdate.join(', ') + ' WHERE id = ?';
      queryParams.push(taskId);

      const [result] = await pool.execute(query, queryParams);
      
      if (result.affectedRows === 0) {
        throw new Error('Task not found');
      }

      return { ...updates, id: taskId };
    } catch (error) {
      throw new Error('Error updating task: ' + error.message);
    }
  }

  // Static method to delete a task by ID
  static async deleteTask(taskId) {
    try {
      const query = 'DELETE FROM tasks WHERE id = ?';
      const [result] = await pool.execute(query, [taskId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error deleting task: ' + error.message);
    }
  }
}

export default TaskModel;
