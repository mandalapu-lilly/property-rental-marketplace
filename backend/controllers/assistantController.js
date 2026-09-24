import { processRentalQuery } from '../services/aiAssistantService.js';

/**
 * @desc    Chat with AI Rental Assistant using natural language
 * @route   POST /api/assistant/chat
 * @access  Public
 */
export const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Please provide a message string for the AI Assistant',
      });
    }

    const result = await processRentalQuery(message.trim());

    return res.status(200).json({
      success: true,
      userQuery: message.trim(),
      reply: result.reply,
      properties: result.properties,
      filtersExtracted: result.filtersExtracted,
      suggestions: result.suggestions,
    });
  } catch (error) {
    next(error);
  }
};
