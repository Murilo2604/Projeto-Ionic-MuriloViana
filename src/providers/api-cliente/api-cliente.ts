import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { AlertController, LoadingController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { Piu } from '../../models/piu';


@Injectable()
export class ApiClienteProvider {

  private _url: string = 'http://piupiuwer.polijunior.com.br/api';

  constructor(public _http: HttpClient,
    public _alertCtrl: AlertController,
    public _loadingCtrl: LoadingController) {
  }

  logaUsuario(usuario: Usuario) {

    return this._http.post(this._url + '/login/', JSON.stringify(usuario), {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: new HttpParams().set('username', usuario.username).set('password', usuario.password)
    });
  }

  cadastraUsuario(usuario: Usuario) {

    return this._http.post(this._url + '/usuarios/registrar/', JSON.stringify(usuario), {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: new HttpParams().set('username', usuario.username)
      .set('email', usuario.email)
      .set('first_name', usuario.first_name)
      .set('last_name', usuario.last_name)
      .set('password', usuario.password)
    });
  }

  carregaPius() {
    return this._http.get<Piu[]>(this._url + '/pius/');
  }

  enviaPiu(piu: Piu) {
    return this._http.post(this._url + '/pius/', JSON.stringify(piu), {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
      params: new HttpParams().set('conteudo', piu.conteudo)
      .set('data', piu.data)
    });
  }

  getUsuario(user_id: number) {
    return this._http.get<Usuario>(this._url + '/usuarios/' + user_id);
  }
}
