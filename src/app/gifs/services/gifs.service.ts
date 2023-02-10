import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private giphyApiKey = 'Bu24HL8ntMjFYKan05Xsr4Ph9WB0aUvD';
  private _history: string[] = [];
  private _giphyApiUrl: string = 'https://api.giphy.com/v1/gifs';

  public results: Gif[] = [];

  get history() {
    return [...this._history];
  }

  constructor(
    private http: HttpClient
  ) {
    this._history = JSON.parse(localStorage.getItem('history')!) || [];
    this.results = JSON.parse(localStorage.getItem('lastResults')!) || [];
  }

  searchGifs( query: string ) {
    
    query = query.trim().toLocaleLowerCase();

    const params = new HttpParams()
      .set('api_key', this.giphyApiKey)
      .set('q', query)
      .set('limit', '10');

    this.http.get<SearchGifsResponse>(`${ this._giphyApiUrl }/search`, { params })
      .subscribe( (response) => {

        // Response has at least one result
        if(response.data.length > 0) {
          this.results = response.data;
          
          // If is not a duplicated query then add to sidebar and localstorage history
          if(!this._history.includes(query)) {
            this._history.unshift( query );
  
            localStorage.setItem('history', JSON.stringify(this._history));
          }

          // Save last results searched
          localStorage.setItem('lastResults', JSON.stringify(this.results));
        }
      });

  }
}
