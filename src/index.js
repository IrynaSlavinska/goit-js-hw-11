import Notiflix from 'notiflix';
import PicturesPixabay from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  pictContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const picturesPixabay = new PicturesPixabay();
let pageCounter = 1;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.loadMoreBtn.classList.add('hidden');

function onSearch(e) {
  // ? start

  e.preventDefault();

  picturesPixabay.searchQuery = e.currentTarget.elements.searchQuery.value;

  if (picturesPixabay.searchQuery === '') {
    clearPictContainer();
    pageCounter = 1;
    refs.loadMoreBtn.classList.add('hidden');
    return Notiflix.Notify.failure('Enter something and try again.');
  }

  picturesPixabay.resetPage();
  clearPictContainer();
  refs.loadMoreBtn.classList.add('hidden');
  pageCounter = 1;

  picturesPixabay.fetchByQuery(pageCounter).then(pics => {
    refs.pictContainer.insertAdjacentHTML('beforeend', createMarkup(pics.hits));
    gallery.refresh();
    refs.loadMoreBtn.classList.remove('hidden');
  });

  // ? end
}

function onLoadMoreClick() {
  // * start
  picturesPixabay.fetchByQuery().then(pics => {
    console.log(pics.totalHits);
    // console.log(createMarkup(pics));
    refs.pictContainer.insertAdjacentHTML('beforeend', createMarkup(pics.hits));
    gallery.refresh();

    pageCounter += 1;
    if (pics.totalHits <= pageCounter * 40) {
      refs.loadMoreBtn.classList.add('hidden');
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
  // * end
}

function clearPictContainer() {
  refs.pictContainer.innerHTML = '';
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        tags,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
      }) => `
  <div class='photo-card'>

<a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="350" />
</a>

    <div class='info'>
      <p class='info-item'>
        <b>Likes: ${likes}</b>
      </p>
      <p class='info-item'>
        <b>Views: ${views}</b>
      </p>
      <p class='info-item'>
        <b>Comments: ${comments}</b>
      </p>
      <p class='info-item'>
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>
`
    )
    .join('');
}

const gallery = new SimpleLightbox('.gallery a', {
  close: false,
  showCounter: false,
});
