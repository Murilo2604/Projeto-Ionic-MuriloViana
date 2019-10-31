import { Usuario } from "./usuario";

export interface Piu {
    favoritado: boolean;
    conteudo: string;
    data: string;
    usuario: Usuario;
}