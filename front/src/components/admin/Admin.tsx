import {FC, useCallback, useEffect, useState} from "react";
import "./Admin.scss";
import {generateUniqueId} from "../../helpers";

interface AdminProps {

}

const Admin: FC<AdminProps> = () => {
  const [users, setUsers] = useState([]);
  const [userToPromote, setUserToPromote] = useState('');
  const [songsContent, setSongsContent] = useState<any>(null);
  const [songName, setSongName] = useState('');

  async function searchSongs() {
    const songs = await fetch(`http://localhost:8080/song/getFiltred?name=${songName}&artist=&username=&genres=&offset=${0}&limit=${5}`)
      .then((response: any) => response.json());

    if (songs.length === 0) {
      return setSongsContent('Ни одной песни не было найдено');
    }

    setSongsContent(songs.reduce((acc: any, curr: any) => {
      // @ts-ignore
      acc.push(<div className={'song'}>
        <span className={'song-field song-title'}>{curr.name}</span>
        <span className={'song-field song-genres'}>Жанры: {curr.genres}</span>
        <span className={'song-field song-year'}>Год выпуска: {curr.year}</span>
        <span className={'song-field song-tags'}>Теги: {curr.tags}</span>
        <button className={'admin-userRemove'} onClick={() => deleteSongById(curr.songId)}>X</button>
      </div>);
      return acc;
    }, []));
  }

  async function deleteUser(username: string) {
    return await fetch(`http://localhost:8080/admin/deleteUser?username=${username}`);
    await getUsers();

  }

  async function deleteSongById(songToDelete: number) {
    await fetch(`http://localhost:8080/admin/deleteSong?songId=${songToDelete}`);
    await searchSongs();
  }

  async function promoteUserById() {
    return await fetch(`http://localhost:8080/admin/giveAdminRoot?username=${userToPromote}`);
  }

  async function getUsers() {
    const users: [] = await fetch(`http://localhost:8080/admin/getAllUsers?offset=0&limit=20`).then((response: any) => response.json());
    setUsers(users.reduce((acc: any, curr: any) => {
      acc.push(<div className={'user'}>
        <span className={'user-id'}></span>
        <span className={'user-login'}>Логин: {curr.username}</span>
        <span className={'user-password'}>Пароль: {curr.password}</span>
        <span className={'user-password'}>ID: {curr.userId}</span>
        <button className={'admin-userRemove'} onClick={() => deleteUser(curr.username)}>X</button>
      </div>);
      return acc;
    }, []));
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <main className={'admin'}>
      <h2 className={'admin-header'}>Админская панель</h2>
      <div className={'admin-movies'}>
        <h2>Управление песнями</h2>
        <div className={'admin-addMovie'}>
          <span className={'admin-fieldName'}>Название</span>
          <input className={'admin-movieInput'} value={songName} onChange={(e: any) => setSongName(e.target.value)}/>
          <button onClick={searchSongs} className={'admin-addMovieButton'}>Искать</button>
        </div>
        {
          songsContent ?
            <>
              <h2>Песни:</h2>
              <div>{songsContent}</div>
            </>
          : null
        }
      </div>
      <div className={'admin-users'}>
        <h2>Управление пользователями</h2>
        <span className={'admin-promoteUser'}>Сделать пользователя админом (by ID):</span>
        <div className={'admin-userPromote'}>
          <input value={userToPromote} onChange={(e: any) => setUserToPromote(e.target.value)} className={'admin-movieInput'} />
          <button onClick={promoteUserById} className={'admin-promoteUserButton'}>Выдать права администратора</button>
        </div>
        <h3>Пользователи:</h3>
        {users}
      </div>
    </main>
  )
}

export default Admin;