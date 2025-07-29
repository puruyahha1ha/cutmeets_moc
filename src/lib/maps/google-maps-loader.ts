/**
 * Google Maps API管理ユーティリティ
 * 重複読み込みを防ぎ、複数のコンポーネント間でAPIの読み込み状態を共有
 */

type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

interface MapsLoaderState {
  state: LoadingState;
  error?: string;
  callbacks: Array<() => void>;
  errorCallbacks: Array<(error: string) => void>;
}

class GoogleMapsLoader {
  private state: MapsLoaderState = {
    state: 'idle',
    callbacks: [],
    errorCallbacks: []
  };

  /**
   * Google Maps APIを読み込む
   * 既に読み込まれている場合は即座にコールバックを実行
   * 読み込み中の場合はコールバックをキューに追加
   */
  load(
    onLoad: () => void,
    onError?: (error: string) => void
  ): () => void {
    // 既に読み込み完了している場合
    if (this.state.state === 'loaded' && window.google?.maps) {
      setTimeout(onLoad, 0);
      return () => {};
    }

    // エラー状態の場合
    if (this.state.state === 'error') {
      if (onError) {
        setTimeout(() => onError(this.state.error || 'Unknown error'), 0);
      }
      return () => {};
    }

    // コールバックを登録
    this.state.callbacks.push(onLoad);
    if (onError) {
      this.state.errorCallbacks.push(onError);
    }

    // 既に読み込み中の場合は何もしない
    if (this.state.state === 'loading') {
      return this.createUnsubscriber(onLoad, onError);
    }

    // 新規読み込み開始
    this.startLoading();

    return this.createUnsubscriber(onLoad, onError);
  }

  /**
   * 読み込みを開始
   */
  private startLoading(): void {
    this.state.state = 'loading';

    try {
      // APIキーをチェック
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        this.handleError('Google Maps APIキーが設定されていません');
        return;
      }

      // 既存のスクリプトタグをチェック
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement;
      if (existingScript) {
        // 既存のスクリプトが完了待ちの場合
        if (window.google?.maps) {
          this.handleLoad();
        } else {
          existingScript.addEventListener('load', () => this.handleLoad());
          existingScript.addEventListener('error', () => this.handleError('Google Maps APIの読み込みに失敗しました'));
        }
        return;
      }

      // 新しいスクリプトタグを作成
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-maps-api', 'true');

      script.addEventListener('load', () => this.handleLoad());
      script.addEventListener('error', () => this.handleError('Google Maps APIの読み込みに失敗しました'));

      document.head.appendChild(script);
    } catch (error) {
      this.handleError(`Google Maps APIの読み込み中にエラーが発生しました: ${error}`);
    }
  }

  /**
   * 読み込み完了処理
   */
  private handleLoad(): void {
    if (!window.google?.maps) {
      this.handleError('Google Maps APIが正しく読み込まれませんでした');
      return;
    }

    this.state.state = 'loaded';
    
    // 成功コールバックを実行
    this.state.callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Google Maps load callback error:', error);
      }
    });

    // コールバックをクリア
    this.state.callbacks = [];
    this.state.errorCallbacks = [];
  }

  /**
   * エラー処理
   */
  private handleError(error: string): void {
    this.state.state = 'error';
    this.state.error = error;

    // エラーコールバックを実行
    this.state.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Google Maps error callback error:', callbackError);
      }
    });

    // コールバックをクリア
    this.state.callbacks = [];
    this.state.errorCallbacks = [];
  }

  /**
   * コールバック登録解除用の関数を作成
   */
  private createUnsubscriber(
    onLoad: () => void,
    onError?: (error: string) => void
  ): () => void {
    return () => {
      const loadIndex = this.state.callbacks.indexOf(onLoad);
      if (loadIndex > -1) {
        this.state.callbacks.splice(loadIndex, 1);
      }

      if (onError) {
        const errorIndex = this.state.errorCallbacks.indexOf(onError);
        if (errorIndex > -1) {
          this.state.errorCallbacks.splice(errorIndex, 1);
        }
      }
    };
  }

  /**
   * 現在の読み込み状態を取得
   */
  getState(): LoadingState {
    return this.state.state;
  }

  /**
   * APIが利用可能かどうかを確認
   */
  isLoaded(): boolean {
    return this.state.state === 'loaded' && Boolean(window.google?.maps);
  }

  /**
   * エラー状態をリセット（再試行用）
   */
  reset(): void {
    if (this.state.state === 'error') {
      this.state.state = 'idle';
      this.state.error = undefined;
    }
  }
}

// シングルトンインスタンス
export const googleMapsLoader = new GoogleMapsLoader();

// React Hook
export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(googleMapsLoader.isLoaded());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (googleMapsLoader.isLoaded()) {
      setIsLoaded(true);
      return;
    }

    setIsLoading(true);
    
    const unsubscribe = googleMapsLoader.load(
      () => {
        setIsLoaded(true);
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
        setIsLoaded(false);
      }
    );

    return unsubscribe;
  }, []);

  const retry = useCallback(() => {
    googleMapsLoader.reset();
    setError(null);
    setIsLoading(true);
    
    const unsubscribe = googleMapsLoader.load(
      () => {
        setIsLoaded(true);
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
        setIsLoaded(false);
      }
    );

    return unsubscribe;
  }, []);

  return { isLoaded, error, isLoading, retry };
}

// 型定義のためのimport
import { useState, useEffect, useCallback } from 'react';