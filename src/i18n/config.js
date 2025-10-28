import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          header: {
            title: "AI Resume Enhancer",
            subtitle: "Intelligent ATS‑Optimized Resume Enhancer"
          },
          upload: {
            title: "Upload your resume as",
            or: "or",
            here: "here",
            button: "Upload",
            note: "We accept PDF, DOCX and TXT files"
          },
          enhancing: {
            title: "Enhancing your resume",
            subtitle: "AI is improving formatting and ATS compatibility"
          },
          errors: {
            title: "Error",
            noText: "No text could be extracted from the uploaded file.",
            generic: "Something went wrong. Please try again."
          },
          enhanced: {
            heading: "Enhanced Resume"
          },
          resume: {
            sections: {
              summary: "Professional Summary",
              experience: "Work Experience",
              education: "Education",
              skills: "Skills",
              languages: "Languages",
              achievements: "Achievements",
              projects: "Projects",
              certifications: "Certifications"
            },
            labels: {
              present: "Present",
              years: "years",
              months: "months",
              now: "Now"
            }
          }
        }
      },
      fr: {
        translation: {
          header: {
            title: "Améliorateur de CV IA",
            subtitle: "Optimisation intelligente des CV pour les ATS"
          },
          upload: {
            title: "Téléversez votre CV en",
            or: "ou",
            here: "ici",
            button: "Téléverser",
            note: "Nous acceptons les fichiers PDF, DOCX et TXT"
          },
          enhancing: {
            title: "Amélioration de votre CV",
            subtitle: "L'IA améliore la mise en forme et la compatibilité ATS"
          },
          errors: {
            title: "Erreur",
            noText: "Aucun texte n'a pu être extrait du fichier téléversé.",
            generic: "Une erreur est survenue. Veuillez réessayer."
          },
          enhanced: {
            heading: "CV Amélioré"
          },
          resume: {
            sections: {
              summary: "Résumé Professionnel",
              experience: "Expérience Professionnelle",
              education: "Formation",
              skills: "Compétences",
              languages: "Langues",
              achievements: "Réalisations",
              projects: "Projets",
              certifications: "Certifications"
            },
            labels: {
              present: "Présent",
              years: "ans",
              months: "mois",
              now: "Maintenant"
            }
          }
        }
      },
      es: {
        translation: {
          header: {
            title: "Mejorador de CV con IA",
            subtitle: "Optimización inteligente de CV para ATS"
          },
          upload: {
            title: "Sube tu currículum en",
            or: "o",
            here: "aquí",
            button: "Subir",
            note: "Aceptamos archivos PDF, DOCX y TXT"
          },
          enhancing: {
            title: "Mejorando tu currículum",
            subtitle: "La IA mejora el formato y la compatibilidad con ATS"
          },
          errors: {
            title: "Error",
            noText: "No se pudo extraer texto del archivo subido.",
            generic: "Algo salió mal. Por favor, inténtalo de nuevo."
          },
          enhanced: {
            heading: "Currículum Mejorado"
          },
          resume: {
            sections: {
              summary: "Resumen Profesional",
              experience: "Experiencia Profesional",
              education: "Educación",
              skills: "Habilidades",
              languages: "Idiomas",
              achievements: "Logros",
              projects: "Proyectos",
              certifications: "Certificaciones"
            },
            labels: {
              present: "Presente",
              years: "años",
              months: "meses",
              now: "Actualidad"
            }
          }
        }
      }
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;