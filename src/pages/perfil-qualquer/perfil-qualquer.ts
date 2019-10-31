import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Piu } from '../../models/piu';
import { Usuario } from '../../models/usuario';
import { ApiClienteProvider } from '../../providers/api-cliente/api-cliente';

@IonicPage()
@Component({
  selector: 'page-perfil-qualquer',
  templateUrl: 'perfil-qualquer.html',
})
export class PerfilQualquerPage {

  public pius = [];

  public usuario: Usuario = {id: 0, username: '', password: '', email: '', first_name: '', last_name: '', foto_perfil: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public _loadingCtrl: LoadingController,
    public _alertCtrl: AlertController,
    public _api: ApiClienteProvider) {

    this.resgatarUsuario();  //Função que obtém o usuário selecionado é chamada no construtor 
    this.carregarPius();  // Função que carrega os pius desse usuário em seu perfil é chamada

  }

  resgatarUsuario() {  // Função que resgata o usuário selecionado através dos navParams
    this.usuario = this.navParams.get('usuario');
  }

  organizarPius(pius: Piu[]) {  // Função que seleciona apenas os pius postados pelo usuário em questão
    let j = 0;
    for (let i = 0; i < pius.length; i++) {
      if (pius[i].usuario.id == this.usuario.id) {
        this.pius[j] = pius[i];
        j++;
      }
    }
  }

  carregarPius() {  // Função que carrega os pius daquele usuário através da API
    let loading = this._loadingCtrl.create({
      content: 'Carregando os pius de ' + this.usuario.first_name + ' ...'
    });

    loading.present();

    this._api.carregaPius()
    .subscribe(
      (pius) => {
        loading.dismiss();
        this.organizarPius(pius.reverse());  // Os pius são passados com o método .reverse() devido à ordem cronológica
      },
      (err) => {
        loading.dismiss();
        console.log(err);
      }
    )
  }
}
