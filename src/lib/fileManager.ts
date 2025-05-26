
import { storage, Photo } from './storage';

interface FileUploadResult {
  success: boolean;
  photo?: Photo;
  error?: string;
}

class FileManager {
  private static instance: FileManager;

  static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  // Process uploaded files
  async processPhotoUpload(
    sessionId: string, 
    file: File
  ): Promise<FileUploadResult> {
    try {
      // Validate file type
      if (!this.isValidImageFile(file)) {
        return {
          success: false,
          error: 'Invalid file type. Please upload JPG, PNG, or WEBP images.'
        };
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return {
          success: false,
          error: 'File size too large. Maximum size is 10MB.'
        };
      }

      // Generate unique filename
      const fileName = this.generateFileName(file.name);
      const photoId = storage.generateId();

      // Create photo object URL for preview
      const url = URL.createObjectURL(file);

      // Create photo record
      const photo: Photo = {
        id: photoId,
        sessionId: sessionId,
        originalName: file.name,
        fileName: fileName,
        uploadedAt: new Date(),
        url: url,
        thumbnailUrl: url // In a real system, you'd generate a thumbnail
      };

      // Store in session
      storage.addPhotoToSession(sessionId, photo);

      return {
        success: true,
        photo: photo
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process photo upload.'
      };
    }
  }

  // Process multiple files
  async processMultiplePhotoUploads(
    sessionId: string, 
    files: FileList
  ): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const result = await this.processPhotoUpload(sessionId, files[i]);
      results.push(result);
    }

    return results;
  }

  // Validate image file type
  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  }

  // Generate unique filename
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop() || 'jpg';
    const baseName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '');
    return `${baseName}_${timestamp}.${extension}`;
  }

  // Create thumbnail (simplified - in real app would use canvas)
  createThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Simulate photo editing and saving
  saveEditedPhoto(photoId: string, editData: any): string {
    // In a real system, this would apply edits and save the file
    // For now, we'll just return a simulated edited URL
    const timestamp = Date.now();
    return `edited_${photoId}_${timestamp}.jpg`;
  }

  // Get photo file size in human readable format
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Validate session folder access
  canAccessSessionFolder(sessionId: string, pin: string): boolean {
    const session = storage.getSessionById(sessionId);
    return session ? session.pin === pin : false;
  }

  // Get session folder structure (simulated)
  getSessionFolderStructure(sessionId: string) {
    const session = storage.getSessionById(sessionId);
    if (!session) return null;

    return {
      sessionId: sessionId,
      sessionName: session.name,
      originalPhotos: session.photos.length,
      folders: {
        originals: `sessions/${sessionId}/originals/`,
        edited: `sessions/${sessionId}/edited/`,
        thumbnails: `sessions/${sessionId}/thumbnails/`
      },
      files: storage.getSessionFiles(sessionId)
    };
  }

  // Simulate printing photos
  async printPhotos(orderIds: string[]): Promise<boolean> {
    try {
      // In a real system, this would interface with printer drivers
      console.log('Printing photos for orders:', orderIds);
      
      // Simulate print job delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update order statuses
      orderIds.forEach(orderId => {
        storage.updateOrder(orderId, { status: 'printed' });
      });

      return true;
    } catch (error) {
      console.error('Print job failed:', error);
      return false;
    }
  }

  // Get system storage statistics
  getStorageStats() {
    const sessions = storage.getSessions();
    const totalPhotos = sessions.reduce((sum, session) => sum + session.photos.length, 0);
    
    return {
      totalSessions: sessions.length,
      totalPhotos: totalPhotos,
      activeSessions: sessions.filter(s => s.status === 'active').length,
      storageUsed: `${totalPhotos * 2.5} MB`, // Estimated
      foldersCreated: sessions.length
    };
  }
}

export const fileManager = FileManager.getInstance();
export type { FileUploadResult };
