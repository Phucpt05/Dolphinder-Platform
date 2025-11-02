import { z } from "zod";

// Define the Dev schema for validation
const DevSchema = z.object({
    name: z.string(),
    username: z.string(),
    avatar: z.string().optional(),
    github: z.string(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
    bio: z.string().optional(),
    slushWallet: z.string().optional(),
});

export type Dev = z.infer<typeof DevSchema>;

/**
 * Load all developer profiles from JSON files
 * This function dynamically imports all JSON files from the developers directory
 */
export async function loadDevelopers(): Promise<Dev[]> {
    // Import all JSON files from the developers directory
    const devModules = import.meta.glob('./developers/*.json');
    const developers: Dev[] = [];

    for (const path in devModules) {
        try {
            const module = await devModules[path]() as { default: unknown };

            // Validate the data against our schema
            const dev = DevSchema.parse(module.default);
            developers.push(dev);
        } catch (error) {
            console.error(`Error loading developer profile from ${path}:`, error);
            // Continue loading other profiles even if one fails
        }
    }

    // Sort by username for consistent ordering
    return developers.sort((a, b) => a.username.localeCompare(b.username));
}

/**
 * Get a specific developer by username
 */
export async function getDeveloperByUsername(username: string): Promise<Dev | null> {
    try {
        const devModule = await import(`./developers/${username}.json`);
        return DevSchema.parse(devModule.default);
    } catch (error) {
        console.error(`Error loading developer profile for ${username}:`, error);
        return null;
    }
}

/**
 * Get all developer usernames (useful for static path generation)
 */
export async function getDeveloperUsernames(): Promise<string[]> {
    const developers = await loadDevelopers();
    return developers.map(dev => dev.username);
}
