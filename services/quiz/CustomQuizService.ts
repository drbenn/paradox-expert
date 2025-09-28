import { Paradox } from "@/types/app.types"
import { CustomQuizFilters } from "@/types/custom-quiz.types"

class CustomQuizService {

  /**
   * 🏆 : Apply filters to available paradoxes
   */
  applyFiltersToFallacies(paradoxes: Paradox[], filters: CustomQuizFilters): Paradox[] {
    return paradoxes.filter(paradox => {
      // Tier filter
      if (filters.selectedTiers.size > 0) {
        const fallacyTier = parseInt(paradox.tier?.toString() || '1')
        if (!filters.selectedTiers.has(fallacyTier)) return false
      }
      
      // Difficulty filter
      if (filters.selectedDifficulty !== 'all' && paradox.difficulty !== filters.selectedDifficulty) {
        return false
      }
      
      // Usage filter
      if (filters.selectedUsage !== null && paradox.usage !== filters.selectedUsage) {
        return false
      }
      
      // Subtlety filter
      if (filters.selectedSubtlety !== null && paradox.subtlety !== filters.selectedSubtlety) {
        return false
      }
      
      // Severity filter
      if (filters.selectedSeverity !== null && paradox.severity !== filters.selectedSeverity) {
        return false
      }
      
      // Intent filter
      if (filters.selectedIntent !== null && paradox.intent !== filters.selectedIntent) {
        return false
      }
      
      // Defensibility filter
      if (filters.selectedDefensibility !== null && paradox.defensibility !== filters.selectedDefensibility) {
        return false
      }
      
      // Context filter
      if (filters.selectedContexts.size > 0 && !filters.selectedContexts.has(paradox.context)) {
        return false
      }
      
      // Medium filter
      if (filters.selectedMediums.size > 0 && !filters.selectedMediums.has(paradox.medium)) {
        return false
      }
      
    return true
  })
}



}




// 🏆 EXPORT THE CLEAN ORCHESTRATOR QUIZ SERVICE!
const customQuizService = new CustomQuizService()
export default customQuizService