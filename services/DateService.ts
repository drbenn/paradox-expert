export class DateService {
  static getLocalISOString(date?: Date | string | number): string {
    const targetDate = date ? new Date(date) : new Date()
    const year = targetDate.getFullYear()
    const month = String(targetDate.getMonth() + 1).padStart(2, '0')
    const day = String(targetDate.getDate()).padStart(2, '0')
    const hour = String(targetDate.getHours()).padStart(2, '0')
    const minute = String(targetDate.getMinutes()).padStart(2, '0')
    const second = String(targetDate.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`
  }
}