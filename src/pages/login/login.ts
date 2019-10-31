import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CadastroPage } from '../cadastro/cadastro'
import { ApiClienteProvider } from '../../providers/api-cliente/api-cliente';
import { HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '../../models/usuario';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public usuario: Usuario = {id: 0, username: '', password: '', email: '', first_name: '', last_name: '', foto_perfil: ''};

  constructor(public navCtrl: NavController,
    private _api: ApiClienteProvider,
    public _loadingCtrl: LoadingController,
    public _alertCtrl: AlertController,
    public _navParams: NavParams,
    public _storage: Storage) {  //No construtor, atrela-se os valores de username e password do login aos advindos da criação de um usuário, na página de cadastro
      this.preencheAutomatico(); //Ademais, caso haja um usuário válido armazenado no Local Storage do cliente, ele logará automaticamente o usuário ao PiuPiuwer

      this.logaAutomatico();
  }

  logar() {     //Funcao responsavel por logar o usuario
    let loading = this._loadingCtrl.create({
      content: 'Validando as informações de login ...'
    });

    loading.present();
    
    this._api.logaUsuario(this.usuario)
    .subscribe(
      (token) => {
        loading.dismiss();
        this._storage.set('token', token);
        this._storage.set('username', this.usuario.username);
        this._storage.set('password', this.usuario.password);
        this.navCtrl.setRoot(HomePage);
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

  private logaAutomatico() {     //Função que loga automaticamente o usuário
    this._storage.get('password').then((senha) => {
      this.usuario.password = senha;
    });

    this._storage.get('username').then((nome) => {
      this.usuario.username = nome;
      let loading = this._loadingCtrl.create({
        content: 'Fazendo o login automático...'
      });

      loading.present();

      this._api.logaUsuario(this.usuario)
      .subscribe(
        (token) => {
          loading.dismiss();
          this._storage.set('token', token);         //Recebendo o novo token 
          this.navCtrl.setRoot(HomePage);            //Indo para a pagina de feed
        },
        (err) => {
          loading.dismiss();
          console.log(err);
          this._alertCtrl.create({
            title: 'Faça seu Login',
            subTitle: 'Não foi encontrado um usuário válido em seu armazenamento local',
            buttons: [{
              text: 'OK'
            }]
          }).present();
        }
      );
    });
  }

  private preencheAutomatico() {     //Função que preenche os valores de input na página de login com as informações advindas da criação do usuário na página de cadastro
    this.usuario.username = this._navParams.get("username");
    this.usuario.password = this._navParams.get("password");
  }
}