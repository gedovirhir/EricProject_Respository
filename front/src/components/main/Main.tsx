import './Main.scss';
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {signOut} from "../../redux/actionCreators";
import {FormEvent, useRef, useState} from "react";
// @ts-ignore
import ReactStars from "react-rating-stars-component";
// @ts-ignore
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import {Simulate} from "react-dom/test-utils";

export default function Main() {
  const dispatch = useDispatch();
  const searchGenreRef = useRef(null);
  const [isStared, setStared] = useState<boolean>(false);
  const [songsContent, setSongsContent] = useState<any>([]);
  const [staredSongs, setStaredSongs] = useState([]);
  const [inputs, setInputs]: any = useState({
    songGenre: '',
    songArtist: '',
    songName: ''
  });
  const [suggested, setSuggested] = useState<string[]>([]);
  const genreSuggested = useRef(null);
  // @ts-ignore
  const handleChange = (e: any) => setInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  const isAdmin = localStorage.getItem('isAdmin');

  async function searchGenre(e: any) {
    handleChange(e);
    const text = e.target.value;
    setSuggested((await fetch(`http://localhost:8080/genre/help?text=${text}&limit=${10}`)
      .then((response: any) => response.json())).genres);
  }

  async function searchSongs() {
    const {songName, songGenre, songArtist} = inputs;
    const username = isStared ? localStorage.getItem('login') : 'NULL';
    const songs = await fetch(`http://localhost:8080/song/getFiltred?name=${songName}&artist=${songArtist}&username=${username}&genres=${songGenre}&offset=${0}&limit=${20}`)
      .then((response: any) => response.json());

    if (songs.length === 0) {
      return setSongsContent('Ни одной песни не было найдено');
    }

    setSongsContent(songs.reduce((acc: any, curr: any) => {
      // @ts-ignore
      const isSongStared: boolean = staredSongs.includes(Number(curr.songId));
      acc.push(<div className={'song'}>
        <div className={'song-buttons'}>
          <button onClick={() => starSong(isSongStared, curr.songId)}
                  className={`song-star ${isSongStared ? 'song-stared' : '' }`}>В избранное</button>
        </div>
        <span className={'song-field song-title'}>{curr.name}</span>
        <span className={'song-field song-genres'}>Имя исполнителя: {curr.artist}</span>
      </div>);
      return acc;
    }, []));
  }

  // async function searchsongs() {
  //   const username = localStorage.getItem('login');
  //   const songs: string[] = await fetch(`http://localhost:8080/song/getFiltred?title=${searchInput || ''}&year=${year || ''}&genres=${genre || ''}&tags=${tags.length == 0 ? '' : tags}&offset=0&limit=20`)
  //     .then((response: any) => response.json());
  //   const staredsongs: any[] = await fetch(`http://localhost:8080/user/getFavs?username=${username}`)
  //     .then((response: any) => response.json());
  //
  //   if (songs.length === 0) {
  //     return setsongContent('По вашему запросу ничего не найдено!');
  //   }

  //   setsongContent(songs.reduce((acc: any, curr: any) => {
  //     const issongStared: boolean = staredsongs.includes(Number(curr.songId));
  //     
  //   }, []));
  // }
  
  async function getStaredSongs() {
    const username = localStorage.getItem('login');
    setStaredSongs(await fetch(`http://localhost:8080/user/getFavs?username=${username}`).then((response) => response.json()));
  }

  async function starSong(currentState: boolean, songId: string) {
    const username = localStorage.getItem('login');
    return await fetch(`http://localhost:8080/fav/addSong?username=${username}&songId=${songId}&label=${currentState ? '0' : '1'}`)
      .then((response: any) => response.json());
  }

  return (
    <>
      <header className={'main-header'}>
          <span className={'main-profilePage'}>{localStorage.getItem('login')}</span>
          <h2 className={'promusic'}>ПРО-МЬЮЗИК</h2>
        <div className={'main-helpersButtons'}>
          {isAdmin &&
          <Link to={'/admin'}>
            <span className={'main-adminPage'}>Панель админа</span>
          </Link>
          }
          <span className={'main-signout'} onClick={() => {
            dispatch(signOut());
            localStorage.removeItem('login');
            localStorage.removeItem('password');
          }}>Выйти</span>
        </div>
      </header>
      <main className={'main'}>
        <section className={'main-filters'}>
          <div className={'main-sendFilters'}>
            <div className={'main-searchFilter'}>
              <span className={'main-name'}>Название песни</span>
              <input className={'main-search'}
                     name={'songName'}
                     value={inputs.songName}
                     onChange={handleChange}/>
            </div>
            <div className={'main-searchFilter'}>
              <span className={'main-name'}>Имя автора</span>
              <input className={'main-search'}
                     ref={searchGenreRef}
                     name={'songArtist'}
                     value={inputs.songArtist}
                     onChange={handleChange}/>
            </div>
            <div className={'main-searchFilter'}>
              <span className={'main-name'}>Жанр</span>
              <input className={'main-search'}
                     name={'songGenre'}
                     onBlur={() => {
                       setTimeout(() => {
                         setSuggested([]);
                       }, 100);
                     }}
                     value={inputs.songGenre}
                     onChange={searchGenre}/>
              {suggested.length ?
                <div ref={genreSuggested} className={'main-suggestedWords'}>
                  {suggested.map((word: string, index, array) => {
                      return (
                        <div onClick={() => {
                          setSuggested([]);
                          setInputs((prevState: any) => ({ ...prevState, songGenre: word }));
                        }}  className={'main-suggestedItem'}>
                          <span className={'main-suggestedName'}>{word}</span>
                          {index !== array.length - 1 ?
                          <hr className={'main-suggestedLine'}/> : null}
                        </div>
                      )}
                  )}
                  </div> : null
                }
            </div>
            <div className={'main-stared'}>
              <label className="main-checkbox path">
                <input onChange={(e: any) => setStared(e.target.checked)} type="checkbox"/>
                <svg viewBox="0 0 21 21">
                  <path
                    d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                </svg>
              </label>
              <span className={'main-staredText'}>В избранном</span>
            </div>
            <button onClick={searchSongs} className={'main-button'}>
              Искать
            </button>
          </div>
        </section>
        <section className={'main-songs'}>
          <div>
            {
              songsContent ? songsContent : 'Начните поиск'
            }
          </div>
        </section>
      </main>
    </>
  )
}