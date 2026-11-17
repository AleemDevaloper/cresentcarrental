import { useContext, useMemo } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import { UIProvider, UIContext } from './UIContext';
import { DocumentProvider, DocumentContext } from './DocumentContext';
import { AiChatProvider } from './AiChatContext';
import { TableThemeProvider } from './TableThemeContext';

export const AppProvider = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      <TableThemeProvider>
        <UIProvider>
          <DocumentProvider>
            <AiChatProvider>
              {children}
            </AiChatProvider>
          </DocumentProvider>
        </UIProvider>
      </TableThemeProvider>
    </ThemeProvider>
  </AuthProvider>
);

export const useApp = () => {
  const auth = useContext(AuthContext);
  const theme = useContext(ThemeContext);
  const ui = useContext(UIContext);
  const doc = useContext(DocumentContext);
  if (!auth || !theme || !ui || !doc) {
    throw new Error('useApp must be used within AppProvider');
  }
  return useMemo(() => ({ ...auth, ...theme, ...ui, ...doc }), [auth, theme, ui, doc]);
};
