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

  public usuario: Usuario = {username: '', password: '', email: '', first_name: '', last_name: ''};

  constructor(public navCtrl: NavController,
    private _api: ApiClienteProvider,
    public _loadingCtrl: LoadingController,
    public _alertCtrl: AlertController,
    public _navParams: NavParams,
    public _storage: Storage) {
      //Nesse construtor, tentamos fazer login com as informacoes advindas do local storage
      this.usuario.username = this._navParams.get("username");
      this.usuario.password = this._navParams.get("password");

      this._storage.get('username').then((nome) => {
        this.getUsernameStorage(nome);                  //
      });                                               // Meu problema esta nessa parte do codigo: não consegui atribuir os valores advindos do localStorage. Assim que saio do .then(), a variavel volta a ser definida como Undefined.
                                                        //Infelizmente, nao consegui ha tempo realizar as devidas correcoes. Como sugestao do stackOverflow, tentei atribui-los por meio de uma funcao, como esta implementado, mas ainda assim nao funcionou
      this._storage.get('password').then((senha) => {
        this.getPasswordStorage(senha);
      });

      let loading = this._loadingCtrl.create({
        content: 'Fazendo o login...'
      });

      loading.present();
      

      this._api.logaUsuario(this.usuario)   //Fazendo o login
      .subscribe(
        (token) => {
          loading.dismiss();
          this._storage.set('token', token);  
          this.navCtrl.setRoot(HomePage);  //Indo para a pagina do feed (que ainda nao esta desenvolvida)
        },
        (err) => {
          loading.dismiss();
          console.log(err);
          this._alertCtrl.create({
            title: 'Faça seu login!',
            subTitle: 'Não foi encontrado um usuário válido no armazenamento local',
            buttons: [{
              text: 'OK'
            }]
          });
        }
      );
  }

  logar() {     //Funcao responsavel por logar o susario
    let loading = this._loadingCtrl.create({
      content: 'Validando as informações de login ...'
    });

    loading.present();
    
    this._api.logaUsuario(this.usuario)
    .subscribe(
      (token) => {
        console.log(token);
        loading.dismiss();
        this._storage.set('token', JSON.stringify(token));
        this._storage.set('username', this.usuario.username);
        this._storage.set('password', this.usuario.password);
        this._storage.get('username').then( (val) => {
          console.log(val);
          
        });
        
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

  getUsernameStorage(nome) {
    console.log(nome);
    
    this.usuario.username = nome;
    
  }

  getPasswordStorage(senha) {
    this.usuario.password = senha;
  }
}
