import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';

interface ModalConfig<TData = unknown, TResult = unknown> {
  data?: TData;
  panelClass?: string;
  disableClose?: boolean;
}

@Injectable({ providedIn: 'root' })
export class Modal {
  private readonly dialog = inject(Dialog);

  open<TResult = unknown, TData = unknown>(
    component: ComponentType<any>,
    config: ModalConfig<TData, TResult> = {},
  ) {
    return this.dialog.open<TResult, TData>(component, {
      data: config.data,
      disableClose: config.disableClose ?? false,
      panelClass: ['app-cdk-modal', ...(config.panelClass || [])],
    });
  }
}
