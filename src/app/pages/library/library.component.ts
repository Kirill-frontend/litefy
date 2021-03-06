import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/models/user';
import { SpotifyUserService } from 'src/app/services/spotify-user.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  constructor(private serviceUsuario: SpotifyUserService, private usuario: UserService) { }

  userPlaylists: any[] = [];
  userAlbums: any[] = [];
  userTracks: any[] = [];

  usuarioLogado: User;

  ngOnInit() {
    let requests = [];

    requests.push(this.serviceUsuario.getUserPlaylists(), this.serviceUsuario.getUserAlbums(), this.serviceUsuario.getUserTracks());
    this.usuario.getUser()
      .subscribe(item => {
        this.usuarioLogado = item;
      });

    forkJoin(requests)
      .subscribe((items: any[]) => {
        this.userPlaylists = items[0].items;
        this.userAlbums = items[1].items;
        this.userTracks = items[2].items;
      });
  }

}
