import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ApiClienteProvider } from '../providers/api-cliente/api-cliente';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { LoginPage } from '../pages/login/login'
import { PerfilPage } from '../pages/perfil/perfil';
import { PiuPage } from '../pages/piu/piu';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';
import { PerfilQualquerPage } from '../pages/perfil-qualquer/perfil-qualquer';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CadastroPage,
    LoginPage,
    PerfilPage,
    PiuPage,
    ConfiguracoesPage,
    PerfilQualquerPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: "piupiuer",
      storeName: "tokens",
      driverOrder: ["indexeddb", "sqlite", "websql"]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CadastroPage,
    LoginPage,
    PerfilPage,
    PiuPage,
    ConfiguracoesPage,
    PerfilQualquerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiClienteProvider
  ]
})
export class AppModule {}
