import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '40019881-2bffa581496356e8a050c3650';

// axios.defaults.headers.common['x-api-key'] = API_KEY;

const options = new URLSearchParams({
  key: API_KEY,

  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
});

export default class PicturesPixabay {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 500;
  }

  fetchByQuery() {
    // console.log(this);
    return axios
      .get(
        `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${options}&per_page=40&page=${this.page}`
      )
      .then(data => {
        // console.log(data.data);
        // if (data.data <= this.totalHits) {
        //   Notiflix.Notify.warning(
        //     "We're sorry, but you've reached the end of search results."
        //   );
        //   refs.loadMoreBtn.classList.add('hidden');
        // }
        console.log(data);
        this.page += 1;
        this.totalHits += 500;
        return data.data;
      })
      .catch(err => {
        // console.log(
        //   "Sorry, there are no images matching your search query. Please try again."
        // );
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  // class end
}

// ретельніше опрацювати тему класів
