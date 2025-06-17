import { toast } from 'react-toastify';

class QuestionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'question';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "option_a" } },
          { field: { Name: "option_b" } },
          { field: { Name: "option_c" } },
          { field: { Name: "option_d" } },
          { field: { Name: "correct_answer" } },
          { field: { Name: "subject" } },
          { field: { Name: "chapter" } },
          { field: { Name: "difficulty" } }
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
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "option_a" } },
          { field: { Name: "option_b" } },
          { field: { Name: "option_c" } },
          { field: { Name: "option_d" } },
          { field: { Name: "correct_answer" } },
          { field: { Name: "subject" } },
          { field: { Name: "chapter" } },
          { field: { Name: "difficulty" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching question with ID ${id}:`, error);
      return null;
    }
  }

  async getBySubject(subject, count = 30) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "option_a" } },
          { field: { Name: "option_b" } },
          { field: { Name: "option_c" } },
          { field: { Name: "option_d" } },
          { field: { Name: "correct_answer" } },
          { field: { Name: "subject" } },
          { field: { Name: "chapter" } },
          { field: { Name: "difficulty" } }
        ],
        where: [
          {
            FieldName: "subject",
            Operator: "EqualTo",
            Values: [subject]
          }
        ],
        pagingInfo: {
          limit: count,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Shuffle the results to simulate random selection
      const shuffled = [...(response.data || [])].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error("Error fetching questions by subject:", error);
      toast.error("Failed to load questions");
      return [];
    }
  }

  async getBySubjectAndChapter(subject, chapter, count = 30) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "option_a" } },
          { field: { Name: "option_b" } },
          { field: { Name: "option_c" } },
          { field: { Name: "option_d" } },
          { field: { Name: "correct_answer" } },
          { field: { Name: "subject" } },
          { field: { Name: "chapter" } },
          { field: { Name: "difficulty" } }
        ],
        where: [
          {
            FieldName: "subject",
            Operator: "EqualTo",
            Values: [subject]
          },
          {
            FieldName: "chapter",
            Operator: "EqualTo",
            Values: [chapter]
          }
        ],
        pagingInfo: {
          limit: count,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Shuffle the results to simulate random selection
      const shuffled = [...(response.data || [])].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error("Error fetching questions by subject and chapter:", error);
      toast.error("Failed to load questions");
      return [];
    }
  }

  async create(question) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: question.Name || question.text?.substring(0, 50) || 'New Question',
        text: question.text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_answer: question.correct_answer,
        subject: question.subject,
        chapter: question.chapter,
        difficulty: question.difficulty
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
          toast.success('Question created successfully');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error("Failed to create question");
      return null;
    }
  }

  async update(id, data) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        ...(data.Name && { Name: data.Name }),
        ...(data.text && { text: data.text }),
        ...(data.option_a && { option_a: data.option_a }),
        ...(data.option_b && { option_b: data.option_b }),
        ...(data.option_c && { option_c: data.option_c }),
        ...(data.option_d && { option_d: data.option_d }),
        ...(data.correct_answer && { correct_answer: data.correct_answer }),
        ...(data.subject && { subject: data.subject }),
        ...(data.chapter && { chapter: data.chapter }),
        ...(data.difficulty && { difficulty: data.difficulty })
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
          toast.success('Question updated successfully');
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update question");
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
          toast.success('Question deleted successfully');
          return { success: true };
        }
      }

      return { success: false };
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question");
      return { success: false };
    }
  }
}

export default new QuestionService();