import { Router } from '@angular/router';
import { ServiceBase } from './../../services/service.base';
import { SpotifyPlayerService } from './../../services/spotify-player.service';
import { Component, Input, OnInit } from '@angular/core';
import { MsToStringPipe } from '../../pipes/ms-to-string.pipe';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css']
})
export class ContentListComponent implements OnInit {

  constructor(private playerService: SpotifyPlayerService, private service: ServiceBase, private router: Router) { }

  @Input() titulo: string;
  @Input() tipo: 'track' | 'playlist' | 'album' | 'artist';
  @Input() lista: any[];
  @Input() rootItem: string = null;
  @Input() album: any = null;
  @Input() modoMobile: boolean = true;

  device_id: string;
  playerState: any;

  ngOnInit() {
    this.playerService.getDeviceId().subscribe(deviceId => {
      this.device_id = deviceId;
    });

    this.getPlayerStatus();
  }

  getPlayerStatus() {
    this.playerService.getPlayerStatus().subscribe(item => {
      this.playerState = item;
      console.log(this.playerState);
    })
  }

  pausar() {
    this.playerService.pause(this.device_id)
    .subscribe();
  }

  getRootItem(item: any) {
    if (this.rootItem) {
      return item[this.rootItem];
    }

    return item;
  }

  abrirArtista(id) {
    if (id != null) {
      this.router.navigate(['/artist/' + id]);
    }
  }

  selecionar(itemSelecionado) {
    this.playerService.play(this.device_id, itemSelecionado)
      .subscribe(item => {
        this.playerService.getCurrentState()
          .subscribe(item => {
            this.playerService.setPlayerStatus(item);
          })
      });
  }

  add(itemSelecionado) {
    this.playerService.add(itemSelecionado, this.device_id)
      .subscribe(item => {
        this.playerService.getCurrentState()
          .subscribe(item => {
            this.playerService.setPlayerStatus(item);
          })
      });
  }

  playAlbum(id) {
    let uris = [];

    this.playerService.getAlbumTracks(id).subscribe(items => {

      items.items.forEach((track) => {
        uris.push(track.uri);
      });

      this.playerService.play(this.device_id, null, uris)
        .subscribe(item => {
          this.playerService.getCurrentState()
            .subscribe(item => {
              this.playerService.setPlayerStatus(item);
            })
        });
    });

  }

  playPlaylist(item) {
    let uris = [];


    this.service.Get<any>(item.tracks.href).subscribe(items => {
      items.items.forEach((track) => {
        uris.push(track.track.uri);
      });

      this.playerService.play(this.device_id, null, uris)
        .subscribe(item => {
          this.playerService.getCurrentState()
            .subscribe(item => {
              this.playerService.setPlayerStatus(item);
            })
        });
    });

  }

  tocarTodas() {
    this.playerService.play(this.device_id, null, this.lista.map(item => this.getRootItem(item).uri))
      .subscribe(item => {
        this.playerService.getCurrentState()
          .subscribe(item => {
            this.playerService.setPlayerStatus(item);
          })
      });
  }
}
