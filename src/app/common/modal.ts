// modal.service.ts
import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';

/**
 * Define el tipo de datos que recibe un componente Modal (Input data)
 * y el tipo de dato que devuelve (Output result)
 */
interface ModalConfig<TData = unknown, TResult = unknown> {
  data?: TData;
  panelClass?: string;
  disableClose?: boolean;
}

@Injectable({ providedIn: 'root' })
export class Modal {
  // Inyectamos el Dialog del CDK para la gestión de overlays
  private readonly dialog = inject(Dialog);

  /**
   * Abre un componente como un modal.
   * @param component Componente standalone a mostrar.
   * @param config Configuración para el modal (datos, clases CSS, etc.).
   * @returns Una referencia al diálogo abierto.
   */
  open<TResult = unknown, TData = unknown>(
    component: ComponentType<any>,
    config: ModalConfig<TData, TResult> = {}
  ) {
    return this.dialog.open<TResult, TData>(component, {
      data: config.data,
      disableClose: config.disableClose ?? false, // Permite cerrar con Esc y click fuera por defecto
      panelClass: ['app-cdk-modal', ...(config.panelClass || [])], // Clase base para el estilo
      // Podemos configurar otras opciones como:
      // hasBackdrop: true,
      // backdropClass: 'cdk-overlay-dark-backdrop',
    });
  }
}
