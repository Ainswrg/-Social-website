import { AppStateType, BaseThunkType, InferActionsTypes } from "./redux-store";
import { usersAPI } from "../api/users-api";
import { UserType } from "../types/Types";
import { updateObjectInArray } from "../utils/object-helper";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

let initialState = {
   users: [] as Array<UserType>,
   pageSize: 5,
   totalUsersCount: 0,
   currentPage: 1,
   isFetching: true,
   followingInProgress: [] as Array<number>, //array of user Ids
};

type InitialStateAction = typeof initialState;

const usersReducer = (
   state = initialState,
   action: ActionTypes
): InitialStateAction => {
   switch (action.type) {
      case "FOLLOW":
         return {
            ...state,
            users: updateObjectInArray(state.users, action.userId, "id", {
               followed: true,
            }),
         };
      case "UNFOLLOW":
         return {
            ...state,
            users: updateObjectInArray(state.users, action.userId, "id", {
               followed: false,
            }),
         };
      case "SET_USERS": {
         return { ...state, users: action.users };
      }
      case "SET_CURRENT_PAGE": {
         return { ...state, currentPage: action.currentPage };
      }
      case "SET_TOTAL_USERS_COUNT": {
         return { ...state, totalUsersCount: action.count };
      }
      case "TOGGLE_IS_FETCHING": {
         return { ...state, isFetching: action.isFetching };
      }
      case "TOGGLE_IS_FOLLOWING_PROGRESS": {
         return {
            ...state,
            followingInProgress: action.isFetching
               ? [...state.followingInProgress, action.userId]
               : state.followingInProgress.filter((id) => id !== action.userId),
         };
      }
      default:
         return state;
   }
};

type ActionTypes = InferActionsTypes<typeof actions>

export const actions = {
   followSuccess: (userId: number) => ({type: 'FOLLOW',userId} as const) ,
   unfollowSuccess: (userId: number) => ({type: 'UNFOLLOW',userId} as const),
   setUsers: (users: Array<UserType>) => ({type: 'SET_USERS',users} as const),
   setCurrentPage: (currentPage: number) => ({type: 'SET_CURRENT_PAGE',currentPage} as const),
   setTotalUsersCount: (totalUsersCount: number) => ({type: 'SET_TOTAL_USERS_COUNT',count: totalUsersCount} as const),
   toggleIsFetching: (isFetching: boolean) => ({type: 'TOGGLE_IS_FETCHING',isFetching} as const),
   toggleFollowingInProgress: (isFetching: boolean,userId: number) => ({type: 'TOGGLE_IS_FOLLOWING_PROGRESS',isFetching,userId} as const),
}

type GetStateType = () => AppStateType;
type DispatchType = Dispatch<ActionTypes>;
type ThunkType = BaseThunkType<ActionTypes>;

export const requestUsers = (page: number, pageSize: number): ThunkType => {
   return async (dispatch: DispatchType, getState: GetStateType) => {
      // getState()
      dispatch(actions.toggleIsFetching(true));
      dispatch(actions.setCurrentPage(page));

      let data = await usersAPI.getUsers(page, pageSize);

      dispatch(actions.toggleIsFetching(false));
      dispatch(actions.setUsers(data.items));
      dispatch(actions.setTotalUsersCount(data.totalCount));
   };
};

const _followUnfollowFlow = async (
   dispatch: DispatchType,
   userId: number,
   apiMethod: any,
   actionCreator: (userId: number) => ActionTypes
) => {
   dispatch(actions.toggleFollowingInProgress(true, userId));
   let response = await apiMethod(userId);
   if (response.data.resultCode === 0) {
      dispatch(actionCreator(userId));
   }
   dispatch(actions.toggleFollowingInProgress(false, userId));
};

export const follow = (userId: number): ThunkType => {
   return async (dispatch) => {
      _followUnfollowFlow(
         dispatch,
         userId,
         usersAPI.follow.bind(usersAPI),
         actions.followSuccess
      );
   };
};

export const unfollow = (userId: number): ThunkType => {
   return async (dispatch) => {
      _followUnfollowFlow(
         dispatch,
         userId,
         usersAPI.unfollow.bind(usersAPI),
         actions.unfollowSuccess
      );
   };
};

export default usersReducer;
