import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { ApiClienteProvider } from '../../providers/api-cliente/api-cliente';
import { Storage } from '@ionic/storage';
import { Piu } from '../../models/piu';
import { MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PiuPage } from '../piu/piu';
import { PerfilPage } from '../perfil/perfil';
import { PerfilQualquerPage } from '../perfil-qualquer/perfil-qualquer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public pius: Piu[];  //Array que guardará todos os pius

  public piusFavoritados = new Array;  //Array qye guardará os pius favoritados

  public usuario: Usuario = {id: 0, username: '', password: '', email: '', first_name: '', last_name: '', foto_perfil: ''};

  constructor(private _api: ApiClienteProvider,
    public _navCtrl: NavController,
    public _loadingCtrl: LoadingController,
    public _alertCtrl: AlertController,
    public _navParams: NavParams,
    public _menuCtrl: MenuController,
    public _storage: Storage) {

      this.carregar();  //A funcao que carrega os pius do servidor é chamada no construtor da pagina

  }

  carregar() {  //Funcao que carrega os pius do servidor
    let loading = this._loadingCtrl.create({
      content: 'Carregando os pius ...'
    });

    loading.present();

    this._api.carregaPius()
    .subscribe(
      (pius) => {
        loading.dismiss();
        this.pius = pius.reverse();  // Aplicando o método .reverse(), a lista de pius fica em ordem de data de publicacao, ja que os mais recentes são adicionados no final do array
      },
      (err) => {
        loading.dismiss();
        console.log(err);
        this._alertCtrl.create({
          title: 'Erro',
          subTitle: 'Não foi possível carregar os Pius no seu feeed. Tente novamente mais tarde',
          buttons: [{
            text: 'OK'
          }]
        }).present();
      }
    )
  }

  deslogar() {  //Função que desloga o usuário e retira suas informações de seu Local Storage
    this._storage.remove('username');
    this._storage.remove('password');
    this._storage.remove('token');
    this._navCtrl.setRoot(LoginPage);
  }

  irPiuPage() {
    this._navCtrl.push(PiuPage, {
      usuario: this.usuario
    });
  }

  irMeuPerfil() {
    this._navCtrl.push(PerfilPage);
  }

  irHomePage() {
    this._menuCtrl.enable(false);
    this._navCtrl.setRoot(HomePage);
  }

  irPerfil(usuario: Usuario) {
    
    this._navCtrl.push(PerfilQualquerPage, {
      usuario: usuario
    });
  }

  favoritarToggle(piu: Piu) {  // Função que altera o estado de piu.favorito de acordo com o clique do usuario
    this.organizarPius(piu);  // A função que organiza os pius é chamada
    piu.favoritado = !piu.favoritado;
  }

  organizarPius(piu: Piu) {  // Função que organiza os pius de acordo com seu atributo favoritado
    if (piu.favoritado == true) { // Caso ele tenha sido desfavoritado, o piu é removido da lista de favoritos e a classe que dá display: none a ele na losta de pius normal também e removida
      for (let i = 0; i < this.piusFavoritados.length; i++) {
        if (this.piusFavoritados[i] == piu) {
          this.piusFavoritados.splice(i, 1);
        }
      }
    } else {  // Caso ele tenha sido favoritado, o piu é adicionado à lista de pius favoritados e é adicionado a ele uma classe na lista de pius normal que o deixa com display: none
      this.piusFavoritados.unshift(piu);
    }
  }

  eliminarPiu(piu: Piu) {  // Função que elimina o piu
    if (piu.favoritado == true) {
      for (let i = 0; i < this.piusFavoritados.length; i++) {
        if (this.piusFavoritados[i] == piu) {
          this.piusFavoritados.splice(i, 1);
        }
      }
    }
    for (let i = 0; i < this.pius.length; i++) {
      if (this.pius[i] == piu) {
        this.pius.splice(i, 1);
      }
    }
  }
}
