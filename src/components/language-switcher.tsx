
"use client"

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Language } from "@/lib/translations";

export function LanguageSwitcher() {
  const { lang, changeLanguage } = useTranslation();

  const options: { label: string; value: Language }[] = [
    { label: "English", value: "en" },
    { label: "አማርኛ", value: "am" },
    { label: "Afaan Oromoo", value: "om" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 rounded-full hover:bg-slate-100">
          <Languages className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">{lang}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((opt) => (
          <DropdownMenuItem 
            key={opt.value} 
            onClick={() => changeLanguage(opt.value)}
            className={`cursor-pointer ${lang === opt.value ? 'bg-slate-50 font-bold' : ''}`}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
