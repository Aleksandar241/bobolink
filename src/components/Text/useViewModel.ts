import type { TranslationKey } from '@/src/localization';
import { useTranslation } from '@/src/localization';

import type { ViewModelProps } from './types';

export function useViewModel({ children }: ViewModelProps) {
  const { t } = useTranslation();

  if (
    typeof children !== 'string' &&
    (typeof children !== 'object' || children === null || !('id' in children))
  ) {
    return {
      text: children,
    };
  }

  if (typeof children === 'object' && children !== null && 'id' in children) {
    const translationObj = children as {
      id: TranslationKey;
      params?: Record<string, string | number>;
    };
    return {
      text: t(translationObj.id, translationObj.params),
    };
  }

  if (typeof children === 'string') {
    try {
      const translated = t(children as TranslationKey);
      return {
        text: translated !== children ? translated : children,
      };
    } catch {
      return {
        text: children,
      };
    }
  }

  return {
    text: children,
  };
}
