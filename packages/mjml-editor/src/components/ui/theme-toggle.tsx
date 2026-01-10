import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '@/context/ThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 rounded-md text-foreground-muted hover:text-foreground hover:bg-accent"
          title="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1">
        <button
          onClick={() => setTheme('light')}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
            theme === 'light'
              ? 'bg-accent text-foreground'
              : 'text-foreground-muted hover:bg-accent hover:text-foreground'
          }`}
        >
          <Sun className="h-4 w-4" />
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
            theme === 'dark'
              ? 'bg-accent text-foreground'
              : 'text-foreground-muted hover:bg-accent hover:text-foreground'
          }`}
        >
          <Moon className="h-4 w-4" />
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
            theme === 'system'
              ? 'bg-accent text-foreground'
              : 'text-foreground-muted hover:bg-accent hover:text-foreground'
          }`}
        >
          <Monitor className="h-4 w-4" />
          System
        </button>
      </PopoverContent>
    </Popover>
  );
}
