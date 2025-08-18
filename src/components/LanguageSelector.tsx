import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="px-4 py-2 text-sm font-semibold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
        >
          {currentLanguage.flag} {currentLanguage.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="[background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`cursor-pointer hover:bg-[hsl(var(--millionaire-blue-light))] ${
              i18n.language === language.code ? 'bg-[hsl(var(--millionaire-blue-light))]' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
