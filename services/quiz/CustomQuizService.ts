import { Paradox } from "@/types/app.types"
import { CustomQuizFilters } from "@/types/custom-quiz.types"

class CustomQuizService {

  /**
   * Apply filters to available paradoxes
   */
  applyFiltersToParadoxes(paradoxes: Paradox[], filters: CustomQuizFilters): Paradox[] {
    return paradoxes.filter(paradox => {
      // Tier filter
      if (filters.selectedTiers.size > 0) {
        const paradoxTier = parseInt(paradox.tier?.toString() || '1')
        if (!filters.selectedTiers.has(paradoxTier)) return false
      }
      
      // Difficulty filter
      if (filters.selectedDifficulty !== 'all' && paradox.difficulty !== filters.selectedDifficulty) {
        return false
      }
      
      // Mind blow factor filter (was severity)
      if (filters.selectedMindBlowFactor !== null && paradox.mind_blow_factor !== filters.selectedMindBlowFactor) {
        return false
      }
      
      // Resolution difficulty filter (was defensibility)
      if (filters.selectedResolutionDifficulty !== null && paradox.resolution_difficulty !== filters.selectedResolutionDifficulty) {
        return false
      }
      
      // Domain filter (was context)
      if (filters.selectedDomains.size > 0 && !filters.selectedDomains.has(paradox.domain)) {
        return false
      }
      
      // Presentation filter (was medium)
      if (filters.selectedPresentations.size > 0 && !filters.selectedPresentations.has(paradox.presentation)) {
        return false
      }
      
      // Prerequisites filter (new for paradoxes)
      if (filters.selectedPrerequisites.size > 0 && !filters.selectedPrerequisites.has(paradox.prerequisites)) {
        return false
      }
      
    return true
  })
}

}

// Export the service
const customQuizService = new CustomQuizService()
export default customQuizService