import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Usuario } from '../../models/usuario';
import { ApiClienteProvider } from '../../providers/api-cliente/api-cliente';
import { Piu } from '../../models/piu';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  public pius: Piu[];

  public decodedJSON: any;

  public globalToken: any;

  public tokenDecodificado: boolean;

  public usuario: Usuario = {id: 0, username: '', password: '', email: '', first_name: '', last_name: '', foto_perfil: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public _storage: Storage,
    public _api: ApiClienteProvider,
    public _loadingCtrl: LoadingController) {

      this._storage.get('token').then((token) => {  // Função que, a partir das informações obtidas do token, constrói a página pessoal do usuário logado
        let loading = this._loadingCtrl.create({
          content: 'Carregando o perfil ...'
        });

        loading.present();

        this.globalToken = token.token;
        console.log(token);
        this.tokenDecodificado = this.tokenDecode();
        this._api.getUsuario(this.usuario.id)  // A partir do ID obtido pelo token, foi possível obter o resto das informações para construir um perfil mais completo
        .subscribe(
          (usuario) => {
            loading.dismiss();
            this.usuario.first_name = usuario.first_name;
            console.log(this.usuario.first_name);
            this.usuario.last_name = usuario.last_name;
            console.log(this.usuario.last_name);
          },
          (err) => {
            loading.dismiss();
            console.log(err);
          }
        )
      });
  }

  tokenDecode() {  // Função que decodifica o token
    const token = this.globalToken;
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      this.decodedJSON = JSON.parse(payload);
      this.usuario.id = this.decodedJSON['user_id'];
      console.log(this.usuario.id);
      this.usuario.username = this.decodedJSON['username'];
      console.log(this.usuario.username);
      this.usuario.email = this.decodedJSON['email'];
      console.log(this.usuario.email);
      return true;
    } else {
      return false;
    }
  }  
  

}
