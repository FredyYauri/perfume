import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/** Acceso seguro a localStorage (tolera modo privado, cuota llena o datos corruptos). */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage: Storage | null = this.resolveStorage();

  read<T>(key: string, isValid: (value: unknown) => value is T, fallback: T): T {
    try {
      const raw = this.storage?.getItem(key);
      if (raw == null) {
        return fallback;
      }
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
    } catch {
      // Sin espacio o almacenamiento bloqueado: la app sigue funcionando sin persistencia.
    }
  }

  remove(key: string): void {
    try {
      this.storage?.removeItem(key);
    } catch {
      // Ignorado a propósito (ver `write`).
    }
  }

  private resolveStorage(): Storage | null {
    try {
      return inject(DOCUMENT).defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
