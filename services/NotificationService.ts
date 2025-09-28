import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { DateService } from './DateService';

// Check if we're in Expo Go (which doesn't support notifications in SDK 53+)
const isExpoGo = Constants.executionEnvironment === 'storeClient';
const notificationsAvailable = !isExpoGo;

// 🔥 CRITICAL: Set up notification handler for foreground notifications
if (notificationsAvailable) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
      shouldShowBanner: true, // Essential for foreground notifications!
      shouldShowList: true,
    }),
  });
}

class NotificationService {
  
  static isAvailable(): boolean {
    return notificationsAvailable;
  }

  static getEnvironmentInfo(): string {
    if (isExpoGo) {
      return 'Expo Go (notifications not supported in SDK 53+)';
    }
    return 'Development/Production build (notifications supported)';
  }

  // 🧠 STATIC: Simple daily fallacy notification content
  static getStaticNotificationContent(): { title: string; body: string } {
    return {
      title: '🧠 Daily Fallacy Challenge',
      body: 'Check out today\'s fallacy of the day and sharpen your critical thinking skills!'
    };
  }

  // 🚀 STATIC: Simple test notification content
  static getTestNotificationContent(): { title: string; body: string } {
    return {
      title: '🚀 Test Notification',
      body: 'This is a test notification from Paradox Expert app!'
    };
  }

  static async requestPermission(): Promise<boolean> {
    if (!notificationsAvailable) {
      Alert.alert(
        'Notifications Not Available',
        `Notifications are not supported in your current environment: ${this.getEnvironmentInfo()}. Use a development build to enable notifications.`,
        [{ text: 'OK' }]
      );
      return false;
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive daily fallacy reminders.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  static async scheduleDaily(hour: number, minute: number = 0): Promise<boolean> {
    if (!notificationsAvailable) {
      console.log('Would schedule notification for', `${hour}:${minute.toString().padStart(2, '0')}`);
      return false;
    }

    try {
      // Cancel existing notifications
      await this.cancelAll();
      
      // Get static content
      const { title, body } = this.getStaticNotificationContent();
      
      // Schedule new notification with static content
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          data: {
            type: 'daily_fallacy',
            targetScreen: 'home',
            scheduledAt: DateService.getLocalISOString(),
          },
        },
        trigger: {
          hour,
          minute,
          type: Notifications.SchedulableTriggerInputTypes.DAILY
        },
      });

      console.log(`🔔 Scheduled daily notification for ${hour}:${minute.toString().padStart(2, '0')}`);
      console.log(`📝 Content: ${title}`);
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  static async cancelAll(): Promise<void> {
    if (!notificationsAvailable) {
      console.log('Would cancel all notifications');
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('🔕 Cancelled all scheduled notifications');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }

  static async getScheduledNotifications(): Promise<any[]> {
    if (!notificationsAvailable) {
      return [];
    }

    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`📋 Found ${scheduled.length} scheduled notifications`);
      return scheduled;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // 🚀 SIMPLE: Test notification
  static async sendTestNotification(): Promise<void> {
    if (!notificationsAvailable) {
      Alert.alert(
        'Test Notification', 
        'This would send a test notification in a development build. Notifications require a development or production build to function.'
      );
      return;
    }

    try {
      // Get static test content
      const { title, body } = this.getTestNotificationContent();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          data: {
            type: 'test',
            testSentAt: DateService.getLocalISOString(),
          },
          badge: 1,
        },
        trigger: {
          seconds: 2,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
      
      console.log('🚀 Test notification scheduled!');
      console.log(`📝 Test content: ${title}`);
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert(
        'Test Error', 
        'Failed to send test notification. Check console for details.'
      );
    }
  }
}

export default NotificationService;