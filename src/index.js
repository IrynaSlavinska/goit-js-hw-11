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

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.loadMoreBtn.classList.add('hidden');

function onSearch(e) {
  // ? start

  e.preventDefault();

  picturesPixabay.searchQuery = e.currentTarget.elements.searchQuery.value;

  if (picturesPixabay.searchQuery === '') {
    clearPictContainer();
    refs.loadMoreBtn.classList.add('hidden');
    return Notiflix.Notify.failure('Enter something and try again.');
  }

  picturesPixabay.resetPage();
  clearPictContainer();
  refs.loadMoreBtn.classList.add('hidden');

  picturesPixabay.fetchByQuery().then(pics => {
    refs.pictContainer.insertAdjacentHTML('beforeend', createMarkup(pics.hits));
    gallery.refresh();
    refs.loadMoreBtn.classList.remove('hidden');
  });

  // ? end
}

const gallery = new SimpleLightbox('.gallery a', {
  close: false,
  showCounter: false,
});

function onLoadMoreClick() {
  // * start
  picturesPixabay.fetchByQuery().then(pics => {
    // console.log(pics);
    // console.log(createMarkup(pics));
    refs.pictContainer.insertAdjacentHTML('beforeend', createMarkup(pics.hits));
    gallery.refresh();
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
