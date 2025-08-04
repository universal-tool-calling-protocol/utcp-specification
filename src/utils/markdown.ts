/**
 * Cleans markdown syntax from text, converting it to plain text
 */
export const cleanMarkdown = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    // Remove markdown headers
    .replace(/^#+\s*/gm, '')
    // Remove bold/italic formatting
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove special markdown characters at start of lines
    .replace(/^>\s*/gm, '')
    // Clean up multiple newlines and spaces
    .replace(/\n\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\r/g, '')
    .trim();
};