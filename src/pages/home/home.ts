import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { ApiClienteProvider } from '../../providers/api-cliente/api-cliente';
import { CadastroPage } from '../cadastro/cadastro';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public usuario: Usuario = {username: '', password: '', email: '', first_name: '', last_name: ''};

  constructor(public navCtrl: NavController,
    private _api: ApiClienteProvider,
    public _navCtrl: NavController,
    public _loadingCtrl: LoadingController,
    public _alertCtrl: AlertController,
    public _navParams: NavParams) {
      this.usuario.username = this._navParams.get("username");
      this.usuario.password = this._navParams.get("password");
  }

  logar() {
    let loading = this._loadingCtrl.create({
      content: 'Validando as informações de login ...'
    });

    loading.present();
    
    this._api.logaUsuario(this.usuario)
    .subscribe(
      (token) => {
        console.log(token);
        loading.dismiss();
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        loading.dismiss();
        this._alertCtrl.create({
          title: 'Erro de validação',
          subTitle: 'Usuário e/ou senha incorreto(s). Por favor, tente novamente!',
          buttons: [
            { text: 'OK' }
          ]
        }).present();
      }
    );
  }

  irPaginaCadastro() {
    this.navCtrl.push(CadastroPage);
  }
}
