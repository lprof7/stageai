import { normalizeSkill } from '../utils/skillNormalizer';

export interface MatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export function computeMatch(cvSkills: string[], offerSkills: string[]): MatchResult {
  const normalizedCv = cvSkills.map(normalizeSkill);
  const normalizedOffer = offerSkills.map(normalizeSkill);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const offerSkill of normalizedOffer) {
    if (normalizedCv.includes(offerSkill)) {
      matchedSkills.push(offerSkill);
    } else {
      missingSkills.push(offerSkill);
    }
  }

  const matchPercentage =
    normalizedOffer.length === 0
      ? 100
      : Math.round((matchedSkills.length / normalizedOffer.length) * 100);

  return { matchPercentage, matchedSkills, missingSkills };
}
