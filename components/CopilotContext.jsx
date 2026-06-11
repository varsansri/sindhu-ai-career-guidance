'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext({ ctx: { title: '', content: '' }, setPageContext: () => {} });

export function CopilotProvider({ children }) {
  const [ctx, setCtx] = useState({ title: '', content: '' });
  const setPageContext = useCallback((title, content) => setCtx({ title: title || '', content: content || '' }), []);
  return <Ctx.Provider value={{ ctx, setPageContext }}>{children}</Ctx.Provider>;
}

export const useCopilot = () => useContext(Ctx);
