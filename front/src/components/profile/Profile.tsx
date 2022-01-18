import {FC, useCallback, useEffect, useState} from "react";
import "./Profile.scss";
import {signOut} from "../../redux/actionCreators";
import {useDispatch} from "react-redux";

interface ProfileProps {

}

const Profile: FC<ProfileProps> = () => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<any>('');
  const [ratedMovies, setRatedMovies] = useState([]);
  const [favMovies, setFavMovies] = useState([]);

  const getUsersInfo = useCallback(async () => {
    const username = localStorage.getItem('login');
    setUserInfo(await fetch(`http://localhost:8080/user/accInfo?username=${username}`)
      .then((response: any) => response.json()));
  }, []);

  const getFavMovies = useCallback(async () => {
    const username = localStorage.getItem('login');
    const movies: [] = await fetch(`http://localhost:8080/user/getFullFavs?username=${username}`).then((response: any) => response.json());
    setFavMovies(movies.reduce((acc: any, curr: any) => {
      acc.push(<div className={'movie'}>
        <span className={'movie-field movie-title'}>{curr.title}</span>
        <span className={'movie-field movie-genres'}>Жанры: {curr.genres}</span>
        <span className={'movie-field movie-year'}>Год выпуска: {curr.year}</span>
        <span className={'movie-field movie-tags'}>Теги: {curr.tags}</span>
      </div>);
      return acc;
    }, []));
  }, []);

  const getRatedMovies = useCallback(async () => {
    const username = localStorage.getItem('login');
    const movies: [] = await fetch(`http://localhost:8080/user/getScored?username=${username}`).then((response: any) => response.json());
    setRatedMovies(movies.reduce((acc: any, curr: any) => {
      acc.push(<div className={'movie'}>
        <span className={'movie-field movie-title'}>{curr.title}</span>
        <span className={'movie-field movie-genres'}>Жанры: {curr.genres}</span>
        <span className={'movie-field movie-year'}>Год выпуска: {curr.year}</span>
        <span className={'movie-field movie-tags'}>Теги: {curr.tags}</span>
      </div>);
      return acc;
    }, []));
  }, []);

  useEffect(() => {
    getUsersInfo();
    getFavMovies();
    getRatedMovies();
  }, []);

  return (
    <main className={'profile'}>
      <div className={'profile-info'}>
        <span className={'profile-name'}>{userInfo.username}</span>
        <button className={'profile-signout'} onClick={
          () => {
            dispatch(signOut());
            localStorage.removeItem('login');
            localStorage.removeItem('password');
          }
        }>Выйти</button>
      </div>
      <span className={'profile-filmsAmount'}>Оцененных: {userInfo.count_rated || 0}</span>
      <span className={'profile-lastFilms'}>Последние оцененные: </span>
      <div className={'profile-rated'}>
        {ratedMovies}
      </div>
      <span className={'profile-filmsAmount'}>Избранных: {userInfo.count_favorites || 0}</span>
      <span className={'profile-lastFilms'}>Последние избранные: </span>
      <div className={'profile-fav'}>
        {favMovies}
      </div>
    </main>
  )
}

export default Profile;