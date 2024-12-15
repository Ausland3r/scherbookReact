import React, { useEffect, useState } from "react";
import { getAllExchanges, getBookById, getUserById } from "../services/api";
import "../styles/Home.css";

const Home = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exchangesData = await getAllExchanges();
        const booksCache = {};
        const usersCache = {};

        for (const exchange of exchangesData) {
          if (exchange.bookId && !booksCache[exchange.bookId]) {
            const bookData = await getBookById(exchange.bookId);
            booksCache[exchange.bookId] = bookData;
          }
          if (exchange.creatorId && !usersCache[exchange.creatorId]) {
            const userData = await getUserById(exchange.creatorId);
            usersCache[exchange.creatorId] = userData;
          }
        }

        const enrichedExchanges = exchangesData.map((exchange) => ({
          ...exchange,
          book: booksCache[exchange.bookId] || { title: "Unknown", author: "Unknown" },
          creator: usersCache[exchange.creatorId] || { username: "Unknown" },
        }));

        setExchanges(enrichedExchanges);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <header>
        <div className="header-content">
          <h1>ScherBook</h1>
          <nav>
            <button>Профиль</button>
            <button>Поиск</button>
          </nav>
        </div>
      </header>
      <main>
        <h2>Недавние обмены</h2>
        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : exchanges.length === 0 ? (
          <p className="no-exchanges">Обмены не найдены.</p>
        ) : (
          <div className="exchange-list">
            {exchanges.map((exchange) => (
              <div className="exchange-item" key={exchange._id}>
                <div className="book-info">
                  <p>
                    <strong>Книга:</strong> {exchange.book.title}
                  </p>
                  <p>
                    <strong>Автор:</strong> {exchange.book.author}
                  </p>
                </div>
                <p>
                  <strong>Владелец:</strong> {exchange.creator.username}
                </p>
                <p>
                  <strong>Статус:</strong> {exchange.status}
                </p>
                {exchange.status === "pending" && (
                  <button className="accept-button">Хочу поменяться</button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
