import { Component } from '@angular/core';
import { IonicPage, NavParams, LoadingController, AlertController, NavController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { ApiClienteProvider } from '../../providers/api-cliente/api-cliente';
import { HomePage } from "../home/home"

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  public usuario: Usuario = { username: '', password: '', email: '', first_name: '', last_name: '' };
  public confirmacao_senha: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public _api: ApiClienteProvider,
    public _loadingCtrl: LoadingController,
    public _alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroPage');
  }

  cadastrar(usuario: Usuario) {    //Funcao responsavel por cadastrar o usuario no banco de dados
    let loading = this._loadingCtrl.create({
      content: 'Criando um usuário...'
    });

    loading.present();

    if (this.formularioEValido() == true) {  //Verficiand se as validacoes iniciais foram devidamente feitas
      this._api.cadastraUsuario(usuario)  //Chamando o metodo que retorna um POST com o endereco de login da API
      .subscribe(
        (data) => {
          console.log(data);
          loading.dismiss();
          this._alertCtrl.create({
            title: 'Usuário criado com sucesso!',
            subTitle: 'Você já pode logar com sua conta PiuPiuwer!',
            buttons: [
              { 
                text: 'OK',
                handler: () => {
                  this.navCtrl.setRoot(HomePage, {
                    username: this.usuario.username,
                    password: this.usuario.password
                  });      //Apos criar o usuario, retorna p a pagina de login com as informacoes ja preenchidas
                }
              }
            ],
          }).present();
        },
        (err) => {
          loading.dismiss();
          console.log(err);
          //"A user with that username already exists."
          if (err.error.username == "A user with that username already exists.") {  //Checando qual tipo de erro e
            this._alertCtrl.create({
              title: "Username já existe",
              subTitle: "Tente novamente com um username diferente!",
              buttons: [{
                text: "OK",
                handler: () => {
                  this.usuario.username = '';
                  this.usuario.email = '';
                  this.usuario.last_name = '';
                  this.usuario.first_name = '';
                  this.usuario.password = '';
                  this.confirmacao_senha = '';
                }
              }]
            }).present();
          } else if (err.error.email == "Enter a valid email address.") {  //Checando qual tipo de erro e
            this._alertCtrl.create({
              title: "Email inválido",
              subTitle: "Digite um e-mail válido",
              buttons: [{
                text: "OK",
                handler: () => {
                  this.usuario.username = '';
                  this.usuario.email = '';
                  this.usuario.last_name = '';
                  this.usuario.first_name = '';
                  this.usuario.password = '';
                  this.confirmacao_senha = '';
                }
              }]
            }).present();
          }
          //Enter a valid email address."
        }
      );
    } else {
      loading.dismiss();
    }
  }

  formularioEValido() {     //Funcao que valida o formulario de acordo com alguns parametros
    if (this.confirmacao_senha != this.usuario.password ) {
      this._alertCtrl.create({
        title: "Senha Inválida",
        subTitle: "As senhas informadas não correspondem. Por favor, tente novamente!",
        buttons: [{
          text: "OK",
          handler: () => {
            this.usuario.username = '';
            this.usuario.email = '';
            this.usuario.last_name = '';
            this.usuario.first_name = '';
            this.usuario.password = '';
          }
        }]
      }).present();
      return false;
    } else if (this.usuario.username.length > 150 || this.usuario.username.split(" ").length > 1) {
      this._alertCtrl.create({
        title: "Username inválido",
        subTitle: "O username não pode conter espaços e deve possuir menos de 150 caracteres!",
        buttons: [{
          text: "OK",
          handler: () => {
            this.usuario.username = '';
            this.usuario.email = '';
            this.usuario.last_name = '';
            this.usuario.first_name = '';
            this.usuario.password = '';
            this.confirmacao_senha = '';
          }
        }]
      }).present();
      return false;
    } else {
      return true;
    }
  }
}
