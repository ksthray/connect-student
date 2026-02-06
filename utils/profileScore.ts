// Imports : Types de User et CandidateProfile générés par Prisma.

interface CandidateProfileData {
  user: {
    fullname: string | null;
    email: string;
    phone: string | null;
  };
  candidateProfile: {
    level: string | null; // Peut être null si non rempli
    university: string | null;
    skills: string[];
    cvUrl: string | null;
    about: string | null;
    // Supposons que 'sectors' est un tableau d'objets ou un tableau vide
    sectors: Array<{ id: string }> | null;
  } | null;
}

interface ProfileStatus {
  score: number;
  details: {
    fullname: boolean;
    phone: boolean;
    about: boolean;
    sectors: boolean;
    skills: boolean;
    cvUrl: boolean;
    level: boolean;
    university: boolean;
  };
}

export function calculateProfileCompletion(
  data: CandidateProfileData
): ProfileStatus {
  let score = 0;
  const TOTAL_POINTS = 100;

  // Initialisation des détails
  const details = {
    fullname: false,
    phone: false,
    about: false,
    sectors: false,
    skills: false,
    cvUrl: false,
    level: false,
    university: false,
  };

  // =========================================================
  // PALIERS DE POINTS
  // =========================================================
  const WEIGHTS = {
    BASE: 20,
    PHONE: 5,
    ABOUT: 15,
    SECTORS: 15,
    SKILLS: 15,
    CV_URL: 15,
    LEVEL: 5,
    UNIVERSITY: 10,
  };

  // 1. BASE (20 points)
  if (data.user.fullname && data.user.email) {
    score += WEIGHTS.BASE;
    details.fullname = true;
  }

  if (!data.candidateProfile) {
    return { score: Math.min(score, TOTAL_POINTS), details };
  }

  const profile = data.candidateProfile;

  // 2. CONTACT (5 points)
  if (data.user.phone) {
    score += WEIGHTS.PHONE;
    details.phone = true;
  }

  // 3. BIOGRAPHIE (15 points)
  if (profile.about && profile.about.length > 20) {
    score += WEIGHTS.ABOUT;
    details.about = true;
  }

  // 4. SECTEURS D'INTÉRÊT (15 points)
  if (profile.sectors && profile.sectors.length > 0) {
    score += WEIGHTS.SECTORS;
    details.sectors = true;
  }

  // 5. COMPÉTENCES (15 points) - Score basé sur plus de 2 compétences
  if (profile.skills && profile.skills.length > 2) {
    score += WEIGHTS.SKILLS;
    details.skills = true;
  }

  // 6. CV (15 points)
  if (profile.cvUrl) {
    score += WEIGHTS.CV_URL;
    details.cvUrl = true;
  }

  // 7. LEVEL (5 points)
  if (profile.level) {
    score += WEIGHTS.LEVEL;
    details.level = true;
  }

  // 8. UNIVERSITÉ (10 points)
  if (profile.university) {
    score += WEIGHTS.UNIVERSITY;
    details.university = true;
  }

  return {
    score: Math.min(score, TOTAL_POINTS),
    details: details,
  };
}
