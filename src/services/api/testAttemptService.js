import { toast } from 'react-toastify';

class TestAttemptService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'test_attempt';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "total_questions" } },
          { field: { Name: "correct_answers" } },
          { field: { Name: "wrong_answers" } },
          { field: { Name: "unattempted" } },
          { field: { Name: "score" } },
          { field: { Name: "time_taken" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "user_id" } }
        ],
        orderBy: [
          {
            fieldName: "completed_at",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching test attempts:", error);
      toast.error("Failed to load test attempts");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "total_questions" } },
          { field: { Name: "correct_answers" } },
          { field: { Name: "wrong_answers" } },
          { field: { Name: "unattempted" } },
          { field: { Name: "score" } },
          { field: { Name: "time_taken" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "user_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching test attempt with ID ${id}:`, error);
      return null;
    }
  }

  async getUserAttempts(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "total_questions" } },
          { field: { Name: "correct_answers" } },
          { field: { Name: "wrong_answers" } },
          { field: { Name: "unattempted" } },
          { field: { Name: "score" } },
          { field: { Name: "time_taken" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "user_id" } }
        ],
        where: [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [userId]
          }
        ],
        orderBy: [
          {
            fieldName: "completed_at",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching user test attempts:", error);
      toast.error("Failed to load test attempts");
      return [];
    }
  }

  async create(attempt) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: attempt.Name || `${attempt.subject} Test - ${new Date().toLocaleDateString()}`,
        subject: attempt.subject,
        total_questions: attempt.totalQuestions,
        correct_answers: attempt.correctAnswers,
        wrong_answers: attempt.wrongAnswers,
        unattempted: attempt.unattempted,
        score: attempt.score,
        time_taken: attempt.timeTaken,
        completed_at: attempt.completedAt || new Date().toISOString(),
        user_id: attempt.userId
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Test attempt saved successfully');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating test attempt:", error);
      toast.error("Failed to save test attempt");
      return null;
    }
  }

  async update(id, data) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        ...(data.Name && { Name: data.Name }),
        ...(data.subject && { subject: data.subject }),
        ...(data.total_questions !== undefined && { total_questions: data.total_questions }),
        ...(data.correct_answers !== undefined && { correct_answers: data.correct_answers }),
        ...(data.wrong_answers !== undefined && { wrong_answers: data.wrong_answers }),
        ...(data.unattempted !== undefined && { unattempted: data.unattempted }),
        ...(data.score !== undefined && { score: data.score }),
        ...(data.time_taken !== undefined && { time_taken: data.time_taken }),
        ...(data.completed_at && { completed_at: data.completed_at }),
        ...(data.user_id && { user_id: data.user_id })
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Test attempt updated successfully');
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating test attempt:", error);
      toast.error("Failed to update test attempt");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false };
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Test attempt deleted successfully');
          return { success: true };
        }
      }

      return { success: false };
    } catch (error) {
      console.error("Error deleting test attempt:", error);
      toast.error("Failed to delete test attempt");
      return { success: false };
    }
  }
}

export default new TestAttemptService();