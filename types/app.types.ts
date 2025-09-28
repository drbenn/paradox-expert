// export interface Paradox {
//   id: string,
//   isFavorite?: boolean,
//   isLearned?: boolean,
//   title: string,
//   type: string,
//   category: string,
//   tier: string,
//   subtitle: string,
//   description: string,
//   usage: "ubiquitous" | "common" | "moderate" | "occasional" | "rare",
//   difficulty: "beginner" | "intermediate" | "advanced" | "expert",
//   context: "social-media" | "politics" | "workplace" | "family" | "academic" | "marketing" | "relationships",
//   medium: "text" | "verbal" | "visual" | "video" | "memes",
//   subtlety: "blatant" | "obvious" | "subtle" | "very-subtle",
//   intent: "defensive" | "offensive" | "persuasive" | "deflective" | "emotional",
//   severity: "mild" | "moderate" | "serious" | "toxic",
//   defensibility: "easy" | "moderate" | "difficult",
//   related_falacies: string[],
//   historical_detail: string[],
//   examples: string[],
//   img_path: string,
//   image_potentials:string[],
//   img_src_link: string,
//   img_src_creator: string,
//   emoji_unicode: string,
//   emoji_shortcode: string,
//   emoji_literal: string,
// }

export interface QuizLearnedParadoxStats {
  totalLearned: number
  learnedIds: string[]
  totalParadoxes: number
}

export interface Paradox {
  id: string,
  isFavorite?: boolean,
  isLearned?: boolean,
  title: string,
  category: string,
  type: "logical" | "mathematical" | "philosophical" | "physical" | "statistical" | "semantic" | "temporal",
  tier: string,
  subtitle: string,
  description: string,
  difficulty: "beginner" | "intermediate" | "advanced" | "expert",
  domain: "everyday-life" | "mathematics" | "physics" | "philosophy" | "economics" | "psychology" | "logic" | "probability",  // replaces context
  presentation: "word-problem" | "thought-experiment" | "mathematical" | "visual" | "interactive" | "scenario",               // replaces medium
  resolution_difficulty: "intuitive" | "requires-explanation" | "academic-debate" | "unresolved",                             // replaces defensibility
  mind_blow_factor: "amusing" | "surprising" | "mind-bending" | "reality-questioning",                                        // replaces severity
  prerequisites: "none" | "basic-logic" | "high-school-math" | "college-math" | "specialized-knowledge",                      // New Additon!              
  related_paradoxes: string[],
  historical_detail: string[],
  examples: string[],
  emoji_unicode: string,
  emoji_shortcode: string,
  emoji_literal: string,
}
