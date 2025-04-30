'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type KeyboardContextType = {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
  hasFocus: boolean;
  focusOut: () => void;
  focusIn: () => void;
  inputRef: React.RefObject<HTMLDivElement> | null;
};

const KeyboardContext = createContext<KeyboardContextType>({
  isKeyboardVisible: false,
  keyboardHeight: 0,
  hasFocus: false,
  focusOut: () => {},
  focusIn: () => {},
  inputRef: null,
});

export const useKeyboard = () => useContext(KeyboardContext);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const focusOut = () => {
    setHasFocus(false);
    setIsKeyboardVisible(false);
    setKeyboardHeight(0);
  };

  const focusIn = () => {
    setHasFocus(true);
    setIsKeyboardVisible(true);
  };

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        focusOut();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <KeyboardContext.Provider
      value={{
        isKeyboardVisible,
        keyboardHeight,
        hasFocus,
        focusOut,
        focusIn,
        inputRef,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
}
