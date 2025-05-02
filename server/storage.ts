import path from 'path';
import fs from 'fs/promises';

interface DialogueData {
  id: number;
  speaker: string;
  audio: string;
}

class StorageService {
  private audioDirectory: string;

  constructor() {
    this.audioDirectory = path.resolve(import.meta.dirname, '../client/public/audio');
  }

  async ensureAudioDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.audioDirectory);
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(this.audioDirectory, { recursive: true });
    }
  }

  async getAudioFiles(): Promise<string[]> {
    try {
      await this.ensureAudioDirectoryExists();
      const files = await fs.readdir(this.audioDirectory);
      return files.filter(file => file.endsWith('.mp3'));
    } catch (error) {
      console.error('Error reading audio directory:', error);
      return [];
    }
  }

  async createBlankAudioFile(filename: string): Promise<boolean> {
    try {
      await this.ensureAudioDirectoryExists();
      const filePath = path.join(this.audioDirectory, filename);
      
      // Create an empty file - in a real application, this would be a valid MP3
      await fs.writeFile(filePath, '');
      return true;
    } catch (error) {
      console.error(`Error creating blank audio file ${filename}:`, error);
      return false;
    }
  }
}

export const storage = new StorageService();
