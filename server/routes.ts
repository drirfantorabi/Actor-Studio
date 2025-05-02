import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "../db";
import { 
  scripts, 
  characters, 
  dialogues, 
  scriptsInsertSchema, 
  charactersInsertSchema, 
  dialoguesInsertSchema 
} from "@shared/schema";
import { eq, and, asc } from "drizzle-orm";
import { z } from "zod";

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
      const requiredFiles = ['ali1.mp3', 'ali2.mp3', 'ayse1.mp3', 'ayse2.mp3', 'romeo1.mp3', 'romeo2.mp3', 'juliet1.mp3', 'juliet2.mp3'];
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

  // Get all scripts
  app.get('/api/scripts', async (req, res) => {
    try {
      const scriptsList = await db.query.scripts.findMany({
        orderBy: [asc(scripts.title)]
      });
      res.json(scriptsList);
    } catch (error) {
      console.error('Error fetching scripts:', error);
      res.status(500).json({ error: 'Failed to fetch scripts list' });
    }
  });

  // Get a single script with its characters and dialogues
  app.get('/api/scripts/:id', async (req, res) => {
    try {
      const scriptId = parseInt(req.params.id);
      if (isNaN(scriptId)) {
        return res.status(400).json({ error: 'Invalid script ID' });
      }

      const script = await db.query.scripts.findFirst({
        where: eq(scripts.id, scriptId),
        with: {
          characters: true,
          dialogues: {
            with: {
              character: true
            },
            orderBy: [asc(dialogues.lineNumber)]
          }
        }
      });

      if (!script) {
        return res.status(404).json({ error: 'Script not found' });
      }

      res.json(script);
    } catch (error) {
      console.error('Error fetching script:', error);
      res.status(500).json({ error: 'Failed to fetch script details' });
    }
  });

  // Create a new script
  app.post('/api/scripts', async (req, res) => {
    try {
      const validatedData = scriptsInsertSchema.parse(req.body);
      const [newScript] = await db.insert(scripts).values(validatedData).returning();
      return res.status(201).json(newScript);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating script:', error);
      return res.status(500).json({ error: 'Failed to create script' });
    }
  });

  // Add a character to a script
  app.post('/api/scripts/:scriptId/characters', async (req, res) => {
    try {
      const scriptId = parseInt(req.params.scriptId);
      if (isNaN(scriptId)) {
        return res.status(400).json({ error: 'Invalid script ID' });
      }

      // Check if script exists
      const script = await db.query.scripts.findFirst({
        where: eq(scripts.id, scriptId)
      });

      if (!script) {
        return res.status(404).json({ error: 'Script not found' });
      }

      // Validate and add the character
      const characterData = { ...req.body, scriptId };
      const validatedData = charactersInsertSchema.parse(characterData);
      const [newCharacter] = await db.insert(characters).values(validatedData).returning();
      
      return res.status(201).json(newCharacter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error adding character:', error);
      return res.status(500).json({ error: 'Failed to add character' });
    }
  });

  // Add dialogue to a script
  app.post('/api/scripts/:scriptId/dialogues', async (req, res) => {
    try {
      const scriptId = parseInt(req.params.scriptId);
      if (isNaN(scriptId)) {
        return res.status(400).json({ error: 'Invalid script ID' });
      }

      // Check if script exists
      const script = await db.query.scripts.findFirst({
        where: eq(scripts.id, scriptId)
      });

      if (!script) {
        return res.status(404).json({ error: 'Script not found' });
      }

      // Determine the next line number
      const maxLineNumberResult = await db.select({
        maxLine: dialogues.lineNumber
      })
      .from(dialogues)
      .where(eq(dialogues.scriptId, scriptId))
      .orderBy(dialogues.lineNumber)
      .limit(1)
      .offset(0);

      const nextLineNumber = maxLineNumberResult.length > 0 ? (maxLineNumberResult[0].maxLine || 0) + 1 : 1;

      // Validate and add the dialogue
      const dialogueData = { 
        ...req.body, 
        scriptId,
        lineNumber: nextLineNumber
      };
      
      const validatedData = dialoguesInsertSchema.parse(dialogueData);
      const [newDialogue] = await db.insert(dialogues).values(validatedData).returning();
      
      return res.status(201).json(newDialogue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error adding dialogue:', error);
      return res.status(500).json({ error: 'Failed to add dialogue' });
    }
  });

  // Get characters for a specific script
  app.get('/api/scripts/:scriptId/characters', async (req, res) => {
    try {
      const scriptId = parseInt(req.params.scriptId);
      if (isNaN(scriptId)) {
        return res.status(400).json({ error: 'Invalid script ID' });
      }

      const charactersList = await db.query.characters.findMany({
        where: eq(characters.scriptId, scriptId),
        orderBy: [asc(characters.name)]
      });

      res.json(charactersList);
    } catch (error) {
      console.error('Error fetching characters:', error);
      res.status(500).json({ error: 'Failed to fetch characters list' });
    }
  });

  // Get dialogues for a specific script
  app.get('/api/scripts/:scriptId/dialogues', async (req, res) => {
    try {
      const scriptId = parseInt(req.params.scriptId);
      if (isNaN(scriptId)) {
        return res.status(400).json({ error: 'Invalid script ID' });
      }

      const dialoguesList = await db.query.dialogues.findMany({
        where: eq(dialogues.scriptId, scriptId),
        with: {
          character: true
        },
        orderBy: [asc(dialogues.lineNumber)]
      });

      res.json(dialoguesList);
    } catch (error) {
      console.error('Error fetching dialogues:', error);
      res.status(500).json({ error: 'Failed to fetch dialogues list' });
    }
  });

  // Handle audio file uploads
  app.post('/api/upload-audio', async (req, res) => {
    try {
      // This would typically handle file uploads
      // For this implementation, we're just creating blank files
      const { filename } = req.body;
      
      if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
      }
      
      const created = await storage.createBlankAudioFile(filename);
      
      if (created) {
        return res.status(201).json({ success: true, path: `/audio/${filename}` });
      } else {
        return res.status(500).json({ error: 'Failed to create audio file' });
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      return res.status(500).json({ error: 'Failed to upload audio file' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
