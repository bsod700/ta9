import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', 
        loadComponent:() => import('./pages/main/main.component').then(mod  => mod.MainComponent),
        title: 'ta9',
    },
];
