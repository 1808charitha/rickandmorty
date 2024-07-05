import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './HomeComponent.css';

const HomeComponent = () => {
  const [info, setInfo] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastEpisodes, setLastEpisodes] = useState({});

  const fetchData = async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`);
      setInfo(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLastEpisodeName = async (characterId, episodeUrl) => {
    try {
      const response = await axios.get(episodeUrl);
      setLastEpisodes((prevState) => ({
        ...prevState,
        [characterId]: response.data.name,
      }));
    } catch (error) {
      setLastEpisodes((prevState) => ({
        ...prevState,
        [characterId]: 'Unknown',
      }));
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    if (info.results) {
      info.results.forEach((character) => {
        if (character.episode.length > 0) {
          const lastEpisodeUrl = character.episode[character.episode.length - 1];
          fetchLastEpisodeName(character.id, lastEpisodeUrl);
        }
      });
    }
  }, [info]);

  const handlePrevious = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    if (info.info && info.info.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container">
      <h1 style={{textAlign:'left',marginLeft:"30px"}}>Rick and Morty</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className="characterList">
            {info.results &&
              info.results.map((character) => (
                <div key={character.id} className="characterItem">
                  <img src={character.image} alt={character.name} className="characterImage" />
                  <p><strong>{character.name}</strong></p>
                  <p>{character.status} - {character.species}</p>
                  <p>Last seen on</p>
                  <p>{lastEpisodes[character.id] || 'Fetching...'}</p>
                </div>
              ))}
          </div>
          <div className="pagination">
            <button onClick={handlePrevious} disabled={page === 1} className="button">
              Previous
            </button>
            <span> Page {page} </span>
            <button onClick={handleNext} disabled={!info.info || !info.info.next} className="button">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeComponent;
