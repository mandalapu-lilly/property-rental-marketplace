import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * Create a single notification safely without throwing uncaught exceptions to caller
 * @param {Object} data - Notification data
 */
export const createNotification = async ({
  recipient,
  sender,
  type,
  title,
  message,
  relatedEntityId,
  relatedEntityType,
  link = '',
}) => {
  try {
    if (!recipient) return null;

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      relatedEntityId,
      relatedEntityType,
      link,
      isRead: false,
    });

    return notification;
  } catch (error) {
    // Non-blocking log: notification failure must NEVER crash main transactions
    console.warn('⚠️ Could not create notification:', error.message);
    return null;
  }
};

/**
 * Broadcast notification to all administrator accounts safely
 * @param {Object} data - Notification data (without recipient)
 */
export const notifyAdmins = async ({
  sender,
  type,
  title,
  message,
  relatedEntityId,
  relatedEntityType,
  link = '',
}) => {
  try {
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    if (!adminUsers || adminUsers.length === 0) return [];

    const notifications = await Promise.all(
      adminUsers.map((admin) =>
        createNotification({
          recipient: admin._id,
          sender,
          type,
          title,
          message,
          relatedEntityId,
          relatedEntityType,
          link,
        })
      )
    );

    return notifications.filter(Boolean);
  } catch (error) {
    console.warn('⚠️ Could not broadcast admin notification:', error.message);
    return [];
  }
};
