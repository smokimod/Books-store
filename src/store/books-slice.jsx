import { AuthFetch } from "../axios-create/instanse";
import {
  getBooksRequest,
  loadingBooksRequest,
  errorBooksRequest,
  getCategoryBookRequest,
  getCurrentBookRequest,
} from "./booksReducer";

export const BooksSlice = () => async (dispatch) => {
  dispatch(loadingBooksRequest());
  try {
    const bookSearchRequest = await AuthFetch("/books");

    await dispatch(getBooksRequest(bookSearchRequest));
  } catch (err) {
    dispatch(errorBooksRequest(err));
  }
};

export const CurrentBookSlice = (id) => async (dispatch) => {
  dispatch(loadingBooksRequest());
  try {
    const currentBookSearchRequest = await AuthFetch(`/books/${id}`);
    await dispatch(getCurrentBookRequest(currentBookSearchRequest));
  } catch (err) {
    dispatch(errorBooksRequest(err));
  }
};

export const CategoryOfBooksSlice = (categories) => async (dispatch) => {
  dispatch(loadingBooksRequest());
  try {
    const genreSearchRequest = await AuthFetch(`/categories`);
    await dispatch(getCategoryBookRequest(genreSearchRequest));
  } catch (err) {
    dispatch(errorBooksRequest(err));
  }
};
