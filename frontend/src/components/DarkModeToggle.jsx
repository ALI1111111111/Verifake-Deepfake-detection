import { useEffect, useState } from 'react';
import { Button } from './ui/Button';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('dark') === '1');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('dark', dark ? '1' : '0');
  }, [dark]);

  return (
    <Button variant="outline" size="sm" onClick={() => setDark((d) => !d)}>
      {dark ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}
