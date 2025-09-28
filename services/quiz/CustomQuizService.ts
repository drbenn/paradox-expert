import { Fallacy } from "@/types/app.types"
import { CustomQuizFilters } from "@/types/custom-quiz.types"

class CustomQuizService {

  /**
   * 🏆 : Apply filters to available fallacies
   */
  applyFiltersToFallacies(fallacies: Fallacy[], filters: CustomQuizFilters): Fallacy[] {
    return fallacies.filter(fallacy => {
      // Tier filter
      if (filters.selectedTiers.size > 0) {
        const fallacyTier = parseInt(fallacy.tier?.toString() || '1')
        if (!filters.selectedTiers.has(fallacyTier)) return false
      }
      
      // Difficulty filter
      if (filters.selectedDifficulty !== 'all' && fallacy.difficulty !== filters.selectedDifficulty) {
        return false
      }
      
      // Usage filter
      if (filters.selectedUsage !== null && fallacy.usage !== filters.selectedUsage) {
        return false
      }
      
      // Subtlety filter
      if (filters.selectedSubtlety !== null && fallacy.subtlety !== filters.selectedSubtlety) {
        return false
      }
      
      // Severity filter
      if (filters.selectedSeverity !== null && fallacy.severity !== filters.selectedSeverity) {
        return false
      }
      
      // Intent filter
      if (filters.selectedIntent !== null && fallacy.intent !== filters.selectedIntent) {
        return false
      }
      
      // Defensibility filter
      if (filters.selectedDefensibility !== null && fallacy.defensibility !== filters.selectedDefensibility) {
        return false
      }
      
      // Context filter
      if (filters.selectedContexts.size > 0 && !filters.selectedContexts.has(fallacy.context)) {
        return false
      }
      
      // Medium filter
      if (filters.selectedMediums.size > 0 && !filters.selectedMediums.has(fallacy.medium)) {
        return false
      }
      
    return true
  })
}



}




// 🏆 EXPORT THE CLEAN ORCHESTRATOR QUIZ SERVICE!
const customQuizService = new CustomQuizService()
export default customQuizService