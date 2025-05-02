import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API endpoints for the Theater Rehearsal Tool
  app.get('/api/audio-files', async (req, res) => {
    try {
      const audioFiles = await storage.getAudioFiles();
      res.json({ files: audioFiles });
    } catch (error) {
      console.error('Error fetching audio files:', error);
      res.status(500).json({ error: 'Failed to fetch audio files' });
    }
  });

  // Endpoint to ensure all required audio files exist
  app.post('/api/ensure-audio-files', async (req, res) => {
    try {
      // Create placeholder audio files if they don't exist
      const requiredFiles = ['ali1.mp3', 'ali2.mp3', 'ayse1.mp3', 'ayse2.mp3'];
      const results = await Promise.all(
        requiredFiles.map(async (file) => {
          const created = await storage.createBlankAudioFile(file);
          return { file, created };
        })
      );
      
      res.json({ results });
    } catch (error) {
      console.error('Error ensuring audio files:', error);
      res.status(500).json({ error: 'Failed to ensure audio files exist' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
