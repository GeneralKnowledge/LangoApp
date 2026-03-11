import ar from '@/data/ui/ar.json';
import bn from '@/data/ui/bn.json';
import de from '@/data/ui/de.json';
import en from '@/data/ui/en.json';
import es from '@/data/ui/es.json';
import fr from '@/data/ui/fr.json';
import hi from '@/data/ui/hi.json';
import id from '@/data/ui/id.json';
import it from '@/data/ui/it.json';
import ja from '@/data/ui/ja.json';
import ko from '@/data/ui/ko.json';
import pt from '@/data/ui/pt.json';
import ru from '@/data/ui/ru.json';
import sw from '@/data/ui/sw.json';
import th from '@/data/ui/th.json';
import tr from '@/data/ui/tr.json';
import ur from '@/data/ui/ur.json';
import vi from '@/data/ui/vi.json';
import zh from '@/data/ui/zh.json';

const dictionaries: Record<string, Record<string, string>> = {
  ar,
  bn,
  de,
  en,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  pt,
  ru,
  sw,
  th,
  tr,
  ur,
  vi,
  zh
};

export function t(uiLanguage: string, key: string): string {
  return dictionaries[uiLanguage]?.[key] ?? dictionaries.en[key] ?? key;
}
