import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ApiClienteProvider } from '../../providers/api-cliente/api-cliente';
import { Piu } from '../../models/piu';
import { HomePage } from '../home/home';
import { Usuario } from '../../models/usuario';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-piu',
  templateUrl: 'piu.html',
})
export class PiuPage {

  public usuario: Usuario = {id: 0, username: '', password: '', email: '', first_name: '', last_name: '', foto_perfil: ''};
  public conteudo: string = '';
  public piu: Piu = { usuario: this.usuario, conteudo: '', data: '', favoritado: false };
  public contador: number = 140 - this.conteudo.length;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public _api: ApiClienteProvider,
    public _storage: Storage,
    public _loadingCtrl: LoadingController,
    public _alertCtrl: AlertController) {

  }

  enviar() { // Função que envia o piu, porém ela não está funcionando

    if (this.verificaPiu() == true) {
      let loading = this._loadingCtrl.create({
        content: "Enviando o piu ..."
      });
  
      loading.present();
  
      let piu = this.piu;
      piu.data = new Date().toISOString();
      piu.conteudo = this.conteudo;
      this._storage.get('username').then((username) => {
        piu.usuario.username = username;
        this._api.enviaPiu(piu)
        .subscribe(
          (data) => {
            this.navCtrl.setRoot(HomePage);
          },
          (err) => {
            console.log(err);
            loading.dismiss();
            this._alertCtrl.create({
              title: "Falha no envio",
              subTitle: "Ocorreu um erro ao enviar o piu. Tente novamente!",
              buttons: [{
                text: "OK"
              }]
            }).present();
          }
        );
      });
    }
  }

  verificaPiu() {  // Função que verifica se o piu é válido para ser enviado
    if (this.conteudo.length > 0 && this.conteudo.length <= 140) {
      return true;
    } else {
      this._alertCtrl.create({
        title: "Piu inválido",
        subTitle: "O piu deve ter entre 1 e 140 caracteres. Tente novamente!",
        buttons: [{
          text: "OK"
        }]
      }).present();
      return false;
    }
  }

}
