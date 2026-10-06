import { LanguageContext, translate } from './LanguageContext.jsx'

export default function LanguageProvider({ language, setLanguage, children }) {
  const t = (text) => translate(language, text)
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}