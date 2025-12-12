// Imports : Types de User et CandidateProfile générés par Prisma.

// Adapter les types à votre nouveau schéma
interface CandidateProfileData {
  user: {
    fullname: string | null; // Renommé 'name' en 'fullname' selon le schéma
    email: string;
    phone: string | null;
  };
  candidateProfile: {
    level: string; // UserLevel
    university: string | null;
    skills: string[];
    cvUrl: string | null;
    about: string | null; // <-- NOUVEAU CHAMP

    // Relation Many-to-Many simplifiée pour le calcul :
    sectors: Array<{ id: string }> | null; // Vérifier si au moins un secteur est connecté
  } | null;
}

export function calculateProfileCompletion(data: CandidateProfileData): number {
  let score = 0;
  const TOTAL_POINTS = 100;

  // =========================================================
  // PALIERS DE POINTS (Total 100)
  // =========================================================
  const WEIGHTS = {
    BASE: 20, // fullname, email
    PHONE: 5,
    ABOUT: 15, // Nouveau
    SECTORS: 15, // Ex-categoryId
    SKILLS: 15,
    CV_URL: 15,
    LEVEL: 5, // Rempli par défaut
    UNIVERSITY: 10, // Poids réduit
  };

  // 1. BASE (20 points)
  // On assume que fullname et email sont remplis à l'inscription (email est unique/requis)
  if (data.user.fullname && data.user.email) {
    score += WEIGHTS.BASE;
  }

  // 2. VÉRIFICATION DU PROFIL CANDIDAT
  if (!data.candidateProfile) {
    // Si le profil n'existe pas, on retourne le score de base
    return score;
  }

  const profile = data.candidateProfile;

  // 3. CONTACT (5 points)
  if (data.user.phone) {
    score += WEIGHTS.PHONE;
  }

  // 4. BIOGRAPHIE (10 points)
  if (profile.about && profile.about.length > 20) {
    score += WEIGHTS.ABOUT;
  }

  // 5. SECTEURS D'INTÉRÊT (15 points)
  // Vérification de la relation Many-to-Many
  if (profile.sectors && profile.sectors.length > 0) {
    score += WEIGHTS.SECTORS;
  }

  // 6. COMPÉTENCES (15 points)
  if (profile.skills && profile.skills.length > 2) {
    score += WEIGHTS.SKILLS;
  }

  // 7. CV (15 points)
  if (profile.cvUrl) {
    score += WEIGHTS.CV_URL;
  }

  // 8. ÉDUCATION/NIVEAU (5 + 10 + 5 = 20 points)

  // Level (5 points)
  if (profile.level) {
    // Devrait être toujours vrai
    score += WEIGHTS.LEVEL;
  }

  // Université (10 points)
  if (profile.university) {
    score += WEIGHTS.UNIVERSITY;
  }

  return Math.min(score, TOTAL_POINTS); // Ne jamais dépasser 100%
}
