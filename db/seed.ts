import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if we already have a sample script
    const existingScripts = await db.query.scripts.findMany({
      limit: 1,
    });

    if (existingScripts.length === 0) {
      console.log("Creating sample script...");
      
      // Insert a sample script
      const [sampleScript] = await db.insert(schema.scripts).values({
        title: "Romeo and Juliet Scene",
        description: "A famous scene from Shakespeare's Romeo and Juliet"
      }).returning();
      
      console.log(`Created script: ${sampleScript.title} (ID: ${sampleScript.id})`);
      
      // Insert characters
      const [romeo] = await db.insert(schema.characters).values({
        scriptId: sampleScript.id,
        name: "Romeo",
        description: "Young man from the Montague family"
      }).returning();
      
      const [juliet] = await db.insert(schema.characters).values({
        scriptId: sampleScript.id,
        name: "Juliet",
        description: "Young woman from the Capulet family"
      }).returning();
      
      console.log(`Created characters: ${romeo.name}, ${juliet.name}`);
      
      // Insert dialogue lines
      const dialogues = [
        {
          scriptId: sampleScript.id,
          characterId: romeo.id,
          lineNumber: 1,
          content: "But, soft! what light through yonder window breaks? It is the east, and Juliet is the sun.",
          audioPath: "/audio/romeo1.mp3"
        },
        {
          scriptId: sampleScript.id,
          characterId: juliet.id,
          lineNumber: 2,
          content: "O Romeo, Romeo! wherefore art thou Romeo? Deny thy father and refuse thy name.",
          audioPath: "/audio/juliet1.mp3"
        },
        {
          scriptId: sampleScript.id,
          characterId: romeo.id,
          lineNumber: 3,
          content: "I take thee at thy word: Call me but love, and I'll be new baptized.",
          audioPath: "/audio/romeo2.mp3"
        },
        {
          scriptId: sampleScript.id,
          characterId: juliet.id,
          lineNumber: 4,
          content: "What man art thou that thus bescreen'd in night so stumblest on my counsel?",
          audioPath: "/audio/juliet2.mp3"
        }
      ];
      
      await db.insert(schema.dialogues).values(dialogues);
      
      console.log(`Added ${dialogues.length} dialogue lines`);

      // Insert another sample script for variety
      const [modernScript] = await db.insert(schema.scripts).values({
        title: "Coffee Shop Meeting",
        description: "A modern scene in a coffee shop"
      }).returning();
      
      console.log(`Created script: ${modernScript.title} (ID: ${modernScript.id})`);
      
      // Insert characters for second script
      const [ali] = await db.insert(schema.characters).values({
        scriptId: modernScript.id,
        name: "Ali",
        description: "A software developer"
      }).returning();
      
      const [ayse] = await db.insert(schema.characters).values({
        scriptId: modernScript.id,
        name: "Ayşe",
        description: "A graphic designer"
      }).returning();
      
      console.log(`Created characters: ${ali.name}, ${ayse.name}`);
      
      // Insert dialogue lines for second script
      const modernDialogues = [
        {
          scriptId: modernScript.id,
          characterId: ali.id,
          lineNumber: 1,
          content: "Hi there! Is this seat taken?",
          audioPath: "/audio/ali1.mp3"
        },
        {
          scriptId: modernScript.id,
          characterId: ayse.id,
          lineNumber: 2,
          content: "No, please feel free to join me. I'm just finishing some design work.",
          audioPath: "/audio/ayse1.mp3"
        },
        {
          scriptId: modernScript.id,
          characterId: ali.id,
          lineNumber: 3,
          content: "Oh, you're a designer? I'm a developer myself. I've been looking for someone to collaborate with.",
          audioPath: "/audio/ali2.mp3"
        },
        {
          scriptId: modernScript.id,
          characterId: ayse.id,
          lineNumber: 4,
          content: "What a coincidence! I've been searching for a developer to work on a project I have in mind.",
          audioPath: "/audio/ayse2.mp3"
        }
      ];
      
      await db.insert(schema.dialogues).values(modernDialogues);
      
      console.log(`Added ${modernDialogues.length} dialogue lines for the modern script`);
    } else {
      console.log("Database already has scripts. Skipping seed data creation.");
    }

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  }
}

seed();
