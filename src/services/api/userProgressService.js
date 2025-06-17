import { toast } from 'react-toastify';

class UserProgressService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'user_progress';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } },
          { field: { Name: "total_tests" } },
          { field: { Name: "biology_average" } },
          { field: { Name: "physics_average" } },
          { field: { Name: "chemistry_average" } },
          { field: { Name: "streak" } }
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
      console.error("Error fetching user progress:", error);
      toast.error("Failed to load user progress");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } },
          { field: { Name: "total_tests" } },
          { field: { Name: "biology_average" } },
          { field: { Name: "physics_average" } },
          { field: { Name: "chemistry_average" } },
          { field: { Name: "streak" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching user progress with ID ${id}:`, error);
      return null;
    }
  }

  async getByUserId(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } },
          { field: { Name: "total_tests" } },
          { field: { Name: "biology_average" } },
          { field: { Name: "physics_average" } },
          { field: { Name: "chemistry_average" } },
          { field: { Name: "streak" } }
        ],
        where: [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const data = response.data || [];
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Error fetching user progress by user ID:", error);
      toast.error("Failed to load user progress");
      return null;
    }
  }

  async create(progress) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: progress.Name || `Progress for ${progress.user_id}`,
        user_id: progress.user_id,
        total_tests: progress.total_tests || 0,
        biology_average: progress.biology_average || 0,
        physics_average: progress.physics_average || 0,
        chemistry_average: progress.chemistry_average || 0,
        streak: progress.streak || 0
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
          toast.success('User progress created successfully');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating user progress:", error);
      toast.error("Failed to create user progress");
      return null;
    }
  }

  async update(id, data) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        ...(data.Name && { Name: data.Name }),
        ...(data.user_id && { user_id: data.user_id }),
        ...(data.total_tests !== undefined && { total_tests: data.total_tests }),
        ...(data.biology_average !== undefined && { biology_average: data.biology_average }),
        ...(data.physics_average !== undefined && { physics_average: data.physics_average }),
        ...(data.chemistry_average !== undefined && { chemistry_average: data.chemistry_average }),
        ...(data.streak !== undefined && { streak: data.streak })
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
          toast.success('User progress updated successfully');
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating user progress:", error);
      toast.error("Failed to update user progress");
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
          toast.success('User progress deleted successfully');
          return { success: true };
        }
      }

      return { success: false };
    } catch (error) {
      console.error("Error deleting user progress:", error);
      toast.error("Failed to delete user progress");
      return { success: false };
    }
  }
}

export default new UserProgressService();