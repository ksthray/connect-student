import axios from "axios";

/**
 * Signale une vue au serveur pour une offre d'emploi.
 * Le serveur gère lui-même le blocage par cookie (48h).
 */
export const trackJobView = async (jobSlug: string) => {
  if (!jobSlug) return;

  // Sécurité frontend : ne pas appeler l'API deux fois durant la MÊME session d'onglet
  const sessionKey = `viewed_${jobSlug}`;
  if (sessionStorage.getItem(sessionKey)) return;

  // On marque IMMÉDIATEMENT en session pour bloquer les appels concurrents (ex: Strict Mode)
  sessionStorage.setItem(sessionKey, "true");

  try {
    // Appel de la route POST que tu as créée
    await axios.post(`/api/candidate/jobs/${jobSlug}/view`);
  } catch (error) {
    // En cas d'erreur, on peut choisir de retirer la clé pour permettre une nouvelle tentative
    // sessionStorage.removeItem(sessionKey);

    // Échec silencieux pour ne pas déranger l'utilisateur
    console.warn("Échec du suivi de vue:", error);
  }
};
