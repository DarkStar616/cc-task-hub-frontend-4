// 🔌 Fake API Service - Replace with real backend calls in Replit
export class FakeApiService {
  // Simulate network delay
  private static async delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Map department names to IDs (replace with actual backend mapping)
  private static getDepartmentId(departmentName: string): string | null {
    const departmentMap: Record<string, string> = {
      Maintenance: "dept_001",
      Housekeeping: "dept_002",
      "Front of House": "dept_003",
      Activities: "dept_004",
      Operations: "dept_005",
      Grounds: "dept_006",
      "All Departments": null, // Special case for cross-department tasks
    }
    return departmentMap[departmentName] || null
  }

  // 🔌 Create Task - POST /api/v1/tasks
  static async createTask(taskData: any) {
    await this.delay(500)

    // Department ID mapping
    const departmentIdMap: Record<string, string> = {
      Maintenance: "dept_001",
      Housekeeping: "dept_002",
      "Front-of-House": "dept_003",
      Activities: "dept_004",
      Operations: "dept_005",
      Grounds: "dept_006",
      "All Departments": "null",
    }

    // Validate department
    const department_id = departmentIdMap[taskData.department]
    if (!department_id && taskData.department !== "All Departments") {
      throw new Error(`Invalid department: ${taskData.department}`)
    }

    // Validate assigned_to array
    if (taskData.assigned_to && !Array.isArray(taskData.assigned_to)) {
      throw new Error("assigned_to must be an array of user IDs")
    }

    // Build POST body for API
    const postBody = {
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority,
      due_date: taskData.due_date || null,
      owner: taskData.owner,
      department_id: department_id === "null" ? null : department_id,
      assigned_to: taskData.assigned_to || [],
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Creating task with payload:", postBody)

    // TODO: Replace with actual API call
    // const response = await fetch('/api/v1/tasks', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify(postBody)
    // })
    //
    // if (!response.ok) {
    //   const error = await response.json()
    //   throw new Error(error.message || 'Failed to create task')
    // }
    //
    // return await response.json()

    // Mock success response
    return {
      success: true,
      message: "Task created successfully",
      task: {
        id: Math.random().toString(36).substr(2, 9),
        ...postBody,
        department: taskData.department, // Keep original department name for UI
      },
    }
  }

  // 🔌 Update Task - PUT /api/v1/tasks/:id
  static async updateTask(taskId: string, taskData: any) {
    await this.delay(500)

    // Similar validation and mapping as createTask
    const departmentIdMap: Record<string, string> = {
      Maintenance: "dept_001",
      Housekeeping: "dept_002",
      "Front-of-House": "dept_003",
      Activities: "dept_004",
      Operations: "dept_005",
      Grounds: "dept_006",
      "All Departments": "null",
    }

    const department_id = departmentIdMap[taskData.department]
    if (!department_id && taskData.department !== "All Departments") {
      throw new Error(`Invalid department: ${taskData.department}`)
    }

    const putBody = {
      ...taskData,
      department_id: department_id === "null" ? null : department_id,
      assigned_to: taskData.assigned_to || [],
      updated_at: new Date().toISOString(),
    }

    console.log("Updating task with payload:", putBody)

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/v1/tasks/${taskId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify(putBody)
    // })

    return {
      success: true,
      message: "Task updated successfully",
      task: {
        id: taskId,
        ...putBody,
        department: taskData.department,
      },
    }
  }

  // 🔌 Complete Task - PATCH /api/v1/tasks/:id/complete
  static async completeTask(taskId: string) {
    await this.delay(300)

    try {
      console.log(`PATCH /api/v1/tasks/${taskId}/complete`)

      // 🔌 TODO: Replace with actual API call
      // const response = await fetch(`/api/v1/tasks/${taskId}/complete`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // })
      //
      // if (!response.ok) {
      //   const error = await response.json()
      //   throw new Error(error.message || 'Failed to complete task')
      // }
      //
      // const result = await response.json()
      // return { success: true, data: result.task }

      // Mock successful response
      return {
        success: true,
        message: "Task completed successfully",
        taskId,
      }
    } catch (error) {
      console.error("Complete Task Error:", error)
      throw new Error("Failed to complete task. Please try again.")
    }
  }

  // 🔌 Delete Task - DELETE /api/v1/tasks/:id
  static async deleteTask(taskId: string) {
    await this.delay(300)

    try {
      console.log(`DELETE /api/v1/tasks/${taskId}`)

      // 🔌 TODO: Replace with actual API call
      // const response = await fetch(`/api/v1/tasks/${taskId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // })
      //
      // if (!response.ok) {
      //   const error = await response.json()
      //   throw new Error(error.message || 'Failed to delete task')
      // }
      //
      // return { success: true }

      // Mock successful response
      return {
        success: true,
        message: "Task deleted successfully",
        taskId,
      }
    } catch (error) {
      console.error("Delete Task Error:", error)
      throw new Error("Failed to delete task. Please try again.")
    }
  }

  // 🔌 Bulk Complete Tasks - PATCH /api/v1/tasks/bulk-complete
  static async bulkCompleteTasks(taskIds: string[]) {
    await this.delay(500)

    try {
      const postBody = { task_ids: taskIds }
      console.log("PATCH /api/v1/tasks/bulk-complete - Request Body:", postBody)

      // 🔌 TODO: Replace with actual API call
      // const response = await fetch('/api/v1/tasks/bulk-complete', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   },
      //   body: JSON.stringify(postBody)
      // })
      //
      // if (!response.ok) {
      //   const error = await response.json()
      //   throw new Error(error.message || 'Failed to complete tasks')
      // }
      //
      // const result = await response.json()
      // return { success: true, data: result.tasks }

      // Mock successful response
      return {
        success: true,
        message: `${taskIds.length} tasks completed successfully`,
        taskIds,
      }
    } catch (error) {
      console.error("Bulk Complete Tasks Error:", error)
      throw new Error("Failed to complete tasks. Please try again.")
    }
  }

  // 🔌 Bulk Delete Tasks - DELETE /api/v1/tasks/bulk-delete
  static async bulkDeleteTasks(taskIds: string[]) {
    await this.delay(500)

    try {
      const postBody = { task_ids: taskIds }
      console.log("DELETE /api/v1/tasks/bulk-delete - Request Body:", postBody)

      // 🔌 TODO: Replace with actual API call
      // const response = await fetch('/api/v1/tasks/bulk-delete', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   },
      //   body: JSON.stringify(postBody)
      // })
      //
      // if (!response.ok) {
      //   const error = await response.json()
      //   throw new Error(error.message || 'Failed to delete tasks')
      // }
      //
      // return { success: true }

      // Mock successful response
      return {
        success: true,
        message: `${taskIds.length} tasks deleted successfully`,
        taskIds,
      }
    } catch (error) {
      console.error("Bulk Delete Tasks Error:", error)
      throw new Error("Failed to delete tasks. Please try again.")
    }
  }
}
