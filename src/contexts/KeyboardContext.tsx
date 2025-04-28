'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type KeyboardContextType = {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
};

const KeyboardContext = createContext<KeyboardContextType>({
  isKeyboardVisible: false,
  keyboardHeight: 0,
});

export const useKeyboard = () => useContext(KeyboardContext);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);

  // フォーカスイベントを使用してキーボード表示状態を検出
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('contenteditable') === 'true'
      ) {
        setHasFocus(true);
        setIsKeyboardVisible(true);
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('contenteditable') === 'true'
      ) {
        setHasFocus(false);
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  // visualViewportを使用してキーボード高さを検出（フォーカス時のみ動作）
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport || !hasFocus) {
      return;
    }

    const visualViewport = window.visualViewport;

    const handleResize = () => {
      // 現在のビューポートの高さとウィンドウ全体の高さの差を計算
      const currentKeyboardHeight = Math.max(
        0,
        window.innerHeight - visualViewport.height,
      );

      // 閾値を設定（iOSの場合はより厳密な条件が必要かもしれない）
      if (currentKeyboardHeight > 100) {
        setIsKeyboardVisible(true);
        setKeyboardHeight(currentKeyboardHeight);
      } else if (currentKeyboardHeight < 50 && !hasFocus) {
        // キーボードが閉じられたと思われる場合
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    };

    // 初期状態を設定
    handleResize();

    visualViewport.addEventListener('resize', handleResize);
    visualViewport.addEventListener('scroll', handleResize);

    return () => {
      visualViewport.removeEventListener('resize', handleResize);
      visualViewport.removeEventListener('scroll', handleResize);
    };
  }, [hasFocus]);

  return (
    <KeyboardContext.Provider value={{ isKeyboardVisible, keyboardHeight }}>
      {children}
    </KeyboardContext.Provider>
  );
}
