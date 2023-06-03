import css from './TweetsCard.module.css';
import logo from 'images/logo.png';
import popup from 'images/popup-img.png';
import avatar from 'images/avatar-img.png';
import { useEffect, useState } from 'react';
import axios from 'axios';

const TweetsCard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://646e54299c677e23218b8751.mockapi.io/users/users'
        );
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleBtnClick = async event => {
    const userId = event.currentTarget.dataset.userId;

    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === userId) {
          const newFollowersCount = user.isFollowing
            ? user.followers - 1
            : user.followers + 1;

          axios
            .put(
              `https://646e54299c677e23218b8751.mockapi.io/users/users/${userId}`,
              {
                ...user,
                isFollowing: !user.isFollowing,
                followers: newFollowersCount,
              }
            )
            .then(response => {
              console.log('Дані оновлено успішно:', response.data);
            })
            .catch(error => {
              console.log('Помилка при оновленні даних:', error);
            });

          return {
            ...user,
            isFollowing: !user.isFollowing,
            followers: newFollowersCount,
          };
        }
        return user;
      });
    });
  };

  const formatNumber = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="container">
      <ul className={css.cardsList}>
        {users.map(user => (
          <li className={css.tweetsCard} key={user.id}>
            <div className={css.cardTop}>
              <a href="https://www.edu.goit.global/">
                <img className={css.logoImg} src={logo} alt="logo" />
              </a>
              <span className={css.popupImg}>
                <img src={popup} alt="chat" />
              </span>
              <span className={css.avatar}>
                <img src={avatar} alt="avatar" />
              </span>
            </div>
            <span className={css.cardLine}></span>
            <div className={css.cardBottom}>
              <p className={css.tweetsCount}>
                <span>{user.tweets}</span> tweets
              </p>
              <p className={css.followersCount}>
                <span>{formatNumber(user.followers)}</span> Followers
              </p>
              <button
                className={`${css.followBtn} ${
                  user.isFollowing ? css.followingBtn : ''
                }`}
                type="button"
                onClick={handleBtnClick}
                data-user-id={user.id}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TweetsCard;
