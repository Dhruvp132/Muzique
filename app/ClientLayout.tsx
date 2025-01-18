'use client';

import { RecoilRoot } from 'recoil';
import { Providers } from './provider';
import { AmountProvider } from './contexts/AmountContext';
import { InterruptProvider } from './contexts/InterruptContext';
import { CreatorProvider, UserCreatorProvider } from './contexts/CreatorContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Appbar } from './components/Appbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <Providers>
        <AmountProvider>
          <CreatorProvider>
            <UserCreatorProvider>
              <ThemeProvider>
                <InterruptProvider>
                  <Appbar />
                  {children}
                </InterruptProvider>
              </ThemeProvider>
            </UserCreatorProvider>
          </CreatorProvider>
        </AmountProvider>
      </Providers>
    </RecoilRoot>
  );
}


