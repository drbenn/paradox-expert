import Button from '@/components/custom/Button'
import Card from '@/components/custom/Card'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import NotificationService from '@/services/NotificationService'
import { useAppState } from '@/state/useAppState'
// import useAppControlState from '@/state/useAppControlState'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets()
  const { colors } = useSystemTheme()

  const notificationsEnabled = useAppState((state) => state.notificationsEnabled)
  const notificationTime = useAppState((state) => state.notificationTime)
  const setNotificationsEnabled = useAppState((state) => state.setNotificationsEnabled)
  const setNotificationTime = useAppState((state) => state.setNotificationTime)

  // Parse existing time or default to 9:00 AM
  const parseTime = (timeString: string | null) => {
    if (!timeString) return { hour: 9, minute: 0 }
    const [hourStr, minuteStr] = timeString.split(':')
    return {
      hour: parseInt(hourStr) || 9,
      minute: parseInt(minuteStr) || 0
    }
  }

  const initialTime = parseTime(notificationTime)
  
  // Convert to 12-hour format for display
  const get12HourFormat = (hour24: number) => {
    if (hour24 === 0) return { hour: 12, period: 'AM' }
    if (hour24 < 12) return { hour: hour24, period: 'AM' }
    if (hour24 === 12) return { hour: 12, period: 'PM' }
    return { hour: hour24 - 12, period: 'PM' }
  }

  const initial12Hour = get12HourFormat(initialTime.hour)
  
  const [hourInput, setHourInput] = useState(initial12Hour.hour.toString())
  const [minuteInput, setMinuteInput] = useState(initialTime.minute.toString().padStart(2, '0'))
  const [period, setPeriod] = useState<'AM' | 'PM'>(initial12Hour.period as 'AM' | 'PM')
  
  const [isAvailable, setIsAvailable] = useState(false)
  const [environmentInfo, setEnvironmentInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsAvailable(NotificationService.isAvailable())
    setEnvironmentInfo(NotificationService.getEnvironmentInfo())
  }, [])

  // Convert inputs to 24-hour format
  const get24HourTime = () => {
    const hour12 = parseInt(hourInput) || 12
    const minute = parseInt(minuteInput) || 0
    
    let hour24: number
    if (period === 'AM') {
      hour24 = hour12 === 12 ? 0 : hour12
    } else {
      hour24 = hour12 === 12 ? 12 : hour12 + 12
    }
    
    return { hour: hour24, minute }
  }

  // Validate inputs silently (for button state)
  const validateInputs = () => {
    const hour = parseInt(hourInput)
    const minute = parseInt(minuteInput)
    
    if (isNaN(hour) || hour < 1 || hour > 12) {
      return false
    }
    
    if (isNaN(minute) || minute < 0 || minute > 59) {
      return false
    }
    
    return true
  }

  // Validate with alerts (for user feedback)
  const validateInputsWithFeedback = () => {
    const hour = parseInt(hourInput)
    const minute = parseInt(minuteInput)
    
    if (isNaN(hour) || hour < 1 || hour > 12) {
      Alert.alert('Invalid Hour', 'Please enter an hour between 1 and 12')
      return false
    }
    
    if (isNaN(minute) || minute < 0 || minute > 59) {
      Alert.alert('Invalid Minute', 'Please enter minutes between 00 and 59')
      return false
    }
    
    return true
  }

  // Format time for display
  const formatTimeDisplay = () => {
    if (!validateInputs()) return 'Invalid time'
    
    const hour = parseInt(hourInput) || 12
    const minute = parseInt(minuteInput) || 0
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  const handleToggleNotifications = async (enabled: boolean) => {
    setIsLoading(true)
    
    if (enabled) {
      if (!validateInputsWithFeedback()) {
        setIsLoading(false)
        return
      }
      
      // Skip permission check in development/emulator
      if (NotificationService.isAvailable()) {
        const hasPermission = await NotificationService.requestPermission()
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive daily reminders.',
            [{ text: 'OK' }]
          )
          setIsLoading(false)
          return
        }
      }
      
      const { hour, minute } = get24HourTime()
      
      // Always allow enabling notifications for UI testing
      setNotificationsEnabled(enabled)
      
      // Save time to state
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      setNotificationTime(timeString)
      
      // Try to schedule if available, but don't fail if not
      if (NotificationService.isAvailable()) {
        await NotificationService.scheduleDaily(hour, minute)
      }
      
      Alert.alert(
        '🔔 Notifications Enabled!',
        NotificationService.isAvailable() 
          ? `You'll receive daily reminders at ${formatTimeDisplay()}`
          : `Notification time set to ${formatTimeDisplay()}. Requires a production build for actual notifications.`,
        [{ text: 'Awesome!' }]
      )
    } else {
      if (NotificationService.isAvailable()) {
        await NotificationService.cancelAll()
      }
      setNotificationsEnabled(enabled)
      Alert.alert(
        '🔕 Notifications Disabled',
        'Daily reminders have been turned off.',
        [{ text: 'OK' }]
      )
    }
    
    setIsLoading(false)
  }

  const handleTimeUpdate = async () => {
    if (!validateInputsWithFeedback()) return
    
    const { hour, minute } = get24HourTime()
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    setNotificationTime(timeString)
    
    setIsLoading(true)
    
    if (NotificationService.isAvailable()) {
      await NotificationService.scheduleDaily(hour, minute)
    }
    
    setIsLoading(false)
    
    Alert.alert(
      '⏰ Time Updated!',
      `Notification time set to ${formatTimeDisplay()}`,
      [{ text: 'Perfect!' }]
    )
  }

  const handleTestNotification = async () => {
    setIsLoading(true)
    await NotificationService.sendTestNotification()
    setIsLoading(false)
    
    Alert.alert(
      '🚀 Test Sent!', 
      NotificationService.isAvailable() 
        ? 'A test notification will appear in 2 seconds. If you don\'t see it, check your notification settings.'
        : 'Test notification triggered! In a production build, you would see a notification in 2 seconds.',
      [{ text: 'OK' }]
    )
  }

  // Handle hour input changes
  const handleHourChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '')
    if (numericText.length <= 2) {
      setHourInput(numericText)
    }
  }

  // Handle minute input changes  
  const handleMinuteChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '')
    if (numericText.length <= 2) {
      setMinuteInput(numericText)
    }
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background, paddingTop: insets.top}]}>

      {/* Back Button */}
      <View style={[{flexDirection: 'row', alignItems: 'center', paddingHorizontal: SHAPES.standardHeaderHorizontalMargin}]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
          <Text style={[styles.backText, {color: colors.primary}]}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={[styles.scrollView]}
        contentContainerStyle={[{paddingBottom: 80}]}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>          
          <Text style={[styles.title, {color: colors.text}]}>Daily Reminders</Text>
          <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
            Get notified to learn a new paradox every day
          </Text>
        </View>

        {/* Enable Notifications */}
        <Card>
          <View style={styles.switchContainer}>
            <View style={styles.switchLabelContainer}>
              <Text style={[styles.sectionTitle, {color: colors.text}]}>Daily Notifications</Text>
              <Text style={[styles.switchSubtitle, {color: colors.textSecondary}]}>
                {notificationsEnabled ? 
                  `Enabled - ${formatTimeDisplay()}` : 
                  'Disabled'
                }
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationsEnabled ? colors.background : colors.textSecondary}
              disabled={isLoading}
            />
          </View>
          <Text style={[styles.description, {color: colors.textSecondary}]}>
            Receive a daily reminder to explore a new logical paradox and take the daily challenge. 
            All notifications are processed locally on your device.
          </Text>
        </Card>

        {/* Time Input - FIXED LAYOUT WITH DISABLED STATE */}
        <View style={styles.cardContainer}>
          <Card>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Notification Time</Text>
            <Text style={[styles.description, {color: colors.textSecondary, marginBottom: 20}]}>
              Choose when you&apos;d like to receive your daily reminder
            </Text>
            
            {/* FIXED: Daily reminder display ABOVE inputs */}
            <View style={[styles.currentTimeContainer, {backgroundColor: colors.surface, borderColor: colors.primary}]}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.currentTimeText, {color: colors.primary}]}>
                Daily reminder currently set at {formatTimeDisplay()}
              </Text>
            </View>
            
            {/* Time Input Container */}
            <View style={styles.timeInputContainer} pointerEvents={notificationsEnabled ? 'auto' : 'none'}>
              
              {/* Hour Input */}
              <View style={styles.timeInputSection}>
                <Text style={[styles.inputLabel, {color: colors.textSecondary}]}>Hour</Text>
                <TextInput
                  style={[
                    styles.timeInput,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                      color: colors.text
                    }
                  ]}
                  value={hourInput}
                  onChangeText={handleHourChange}
                  placeholder="12"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  maxLength={2}
                  textAlign="center"
                  editable={notificationsEnabled}
                />
                {/* FIXED: Removed hint text completely */}
              </View>

              {/* Colon Separator */}
              <View style={styles.colonContainer}>
                <Text style={[styles.colon, {color: colors.text}]}>:</Text>
              </View>

              {/* Minute Input */}
              <View style={styles.timeInputSection}>
                <Text style={[styles.inputLabel, {color: colors.textSecondary}]}>Minute</Text>
                <TextInput
                  style={[
                    styles.timeInput,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                      color: colors.text
                    }
                  ]}
                  value={minuteInput}
                  onChangeText={handleMinuteChange}
                  placeholder="00"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  maxLength={2}
                  textAlign="center"
                  editable={notificationsEnabled}
                />
                {/* FIXED: Removed hint text completely */}
              </View>

              {/* AM/PM Selector */}
              <View style={styles.periodContainer}>
                <Text style={[styles.inputLabel, {color: colors.textSecondary}]}>Period</Text>
                <View style={styles.periodButtons}>
                  <TouchableOpacity
                    onPress={() => setPeriod('AM')} // FIXED: Only change period, no handleTimeUpdate
                    style={[
                      styles.periodButton,
                      {
                        backgroundColor: period === 'AM' ? colors.primary : colors.surface,
                        borderColor: colors.border
                      }
                    ]}
                    disabled={!notificationsEnabled}
                  >
                    <Text style={[
                      styles.periodText,
                      {
                        color: period === 'AM' ? colors.background : colors.text,
                        fontWeight: period === 'AM' ? 'bold' : 'normal'
                      }
                    ]}>
                      AM
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setPeriod('PM')} // FIXED: Only change period, no handleTimeUpdate
                    style={[
                      styles.periodButton,
                      {
                        backgroundColor: period === 'PM' ? colors.primary : colors.surface,
                        borderColor: colors.border
                      }
                    ]}
                    disabled={!notificationsEnabled}
                  >
                    <Text style={[
                      styles.periodText,
                      {
                        color: period === 'PM' ? colors.background : colors.text,
                        fontWeight: period === 'PM' ? 'bold' : 'normal'
                      }
                    ]}>
                      PM
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* FIXED: Added missing Set Notification button BELOW inputs */}
            <Button 
              title={isLoading ? "Setting..." : "Set Notification"}
              onPress={handleTimeUpdate}
              disabled={!validateInputs() || isLoading || !notificationsEnabled}
              style={{ marginTop: 20 }}
            />
          </Card>
          
          {/* Disabled Overlay */}
          {!notificationsEnabled && (
            <View style={[styles.disabledOverlay, {backgroundColor: colors.text}]} />
          )}
        </View>

        {/* Test Notification */}
        <Card>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Test Notifications</Text>
          <Text style={[styles.description, {color: colors.textSecondary, marginBottom: 16}]}>
            Send a test notification to make sure everything is working properly.
          </Text>
          <Button 
            title={isLoading ? "Sending..." : "Send Test Notification"}
            onPress={handleTestNotification}
            variant="outline"
            disabled={isLoading}
          />
          {!isAvailable && (
            <Text style={[styles.warningText, {color: colors.textSecondary, marginTop: 8}]}>
              ℹ️ Test notifications may not work in preview builds
            </Text>
          )}
        </Card>

        {/* Info */}
        <Card>
          <Text style={[styles.infoTitle, {color: colors.text}]}>💡 How It Works</Text>
          <Text style={[styles.description, {color: colors.textSecondary}]}>
            Daily notifications will remind you to explore a new logical paradox at your chosen time. 
            All notifications are processed locally on your device - no data is sent to external servers.
            {'\n\n'}You can change your notification time or disable notifications at any time from this screen.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 24
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
  },
  backText: {
    fontSize: 18,
    marginLeft: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabelContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  switchSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Time input styles
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  timeInputSection: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  timeInput: {
    width: 60,
    height: 56,
    borderWidth: SHAPES.cardBorderWidth,
    borderRadius: SHAPES.borderRadius,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  colonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0, // FIXED: Align colon with input boxes
  },
  colon: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 34,
  },
  periodContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 10
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: SHAPES.borderRadius,
    borderWidth: SHAPES.cardBorderWidth,
    minWidth: 60,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
  },
  currentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: SHAPES.borderRadius,
    borderWidth: SHAPES.cardBorderWidth,
    marginBottom: 20,
  },
  currentTimeText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  
  // Removed selectedTimeContainer styles as they're no longer needed
  
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SHAPES.borderRadius,
    fontSize: 12,
  },
  warningText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  
  // New styles for disabled state
  cardContainer: {
    position: 'relative',
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    height: '95%',
    borderRadius: SHAPES.borderRadius, // Match card border radius
  },
})