import { PhrasePack } from './types';
import spanish from '@/data/packs/spanish.json';
import french from '@/data/packs/french.json';
import arabic from '@/data/packs/arabic.json';
import hindi from '@/data/packs/hindi.json';
import mandarin from '@/data/packs/mandarin-chinese.json';
import portuguese from '@/data/packs/portuguese.json';
import russian from '@/data/packs/russian.json';
import german from '@/data/packs/german.json';
import japanese from '@/data/packs/japanese.json';
import swahili from '@/data/packs/swahili.json';
import bengali from '@/data/packs/bengali.json';
import urdu from '@/data/packs/urdu.json';
import indonesian from '@/data/packs/indonesian.json';
import turkish from '@/data/packs/turkish.json';
import korean from '@/data/packs/korean.json';
import vietnamese from '@/data/packs/vietnamese.json';
import italian from '@/data/packs/italian.json';
import thai from '@/data/packs/thai.json';

const packs: Record<string, PhrasePack> = {
  es: spanish as PhrasePack,
  fr: french as PhrasePack,
  ar: arabic as PhrasePack,
  hi: hindi as PhrasePack,
  zh: mandarin as PhrasePack,
  pt: portuguese as PhrasePack,
  ru: russian as PhrasePack,
  de: german as PhrasePack,
  ja: japanese as PhrasePack,
  sw: swahili as PhrasePack,
  bn: bengali as PhrasePack,
  ur: urdu as PhrasePack,
  id: indonesian as PhrasePack,
  tr: turkish as PhrasePack,
  ko: korean as PhrasePack,
  vi: vietnamese as PhrasePack,
  it: italian as PhrasePack,
  th: thai as PhrasePack
};

export function getPack(langCode: string): PhrasePack | undefined {
  return packs[langCode];
}
